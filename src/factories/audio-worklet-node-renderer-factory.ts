import { connectAudioParam } from '../helpers/connect-audio-param';
import { createNestedArrays } from '../helpers/create-nested-arrays';
import { getAudioNodeConnections } from '../helpers/get-audio-node-connections';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import {
    IAudioWorkletNode,
    IAudioWorkletNodeOptions,
    IAudioWorkletProcessorConstructor,
    IMinimalOfflineAudioContext,
    INativeAudioWorkletNode
} from '../interfaces';
import {
    TAudioWorkletNodeRendererFactoryFactory,
    TNativeAudioBuffer,
    TNativeAudioBufferSourceNode,
    TNativeAudioParam,
    TNativeChannelMergerNode,
    TNativeGainNode,
    TNativeOfflineAudioContext
} from '../types';

const processBuffer = (
    proxy: IAudioWorkletNode,
    renderedBuffer: TNativeAudioBuffer,
    offlineAudioContext: TNativeOfflineAudioContext,
    options: { outputChannelCount: number[] } & IAudioWorkletNodeOptions,
    processorDefinition: undefined | IAudioWorkletProcessorConstructor
): TNativeAudioBuffer => {
    const { length } = renderedBuffer;
    const numberOfInputChannels = options.channelCount * options.numberOfInputs;
    const numberOfOutputChannels = options.outputChannelCount.reduce((sum, value) => sum + value, 0);
    const processedBuffer = offlineAudioContext.createBuffer(
        numberOfOutputChannels,
        length,
        renderedBuffer.sampleRate
    );

    if (processorDefinition === undefined) {
        throw new Error();
    }

    const audioNodeConnections = getAudioNodeConnections(proxy);
    const audioWorkletProcessor = new processorDefinition(options);

    const inputs = createNestedArrays(options.numberOfInputs, options.channelCount);
    const outputs = createNestedArrays(options.numberOfInputs, options.outputChannelCount);
    const parameters: { [ name: string ]: Float32Array } = Array
        .from(proxy.parameters.keys())
        .reduce((prmtrs, name, index) => {
            return { ...prmtrs, [ name ]: renderedBuffer.getChannelData(numberOfInputChannels + index) };
        }, { });

    for (let i = 0; i < length; i += 128) {
        for (let j = 0; j < options.numberOfInputs; j += 1) {
            for (let k = 0; k < options.channelCount; k += 1) {
                // Bug #5: Safari does not support copyFromChannel().
                const slicedRenderedBuffer = renderedBuffer
                    .getChannelData(k)
                    .slice(i, i + 128);

                inputs[j][k].set(slicedRenderedBuffer);
            }
        }

        processorDefinition.parameterDescriptors.forEach(({ name }, index) => {
            const slicedRenderedBuffer = renderedBuffer
                .getChannelData(numberOfInputChannels + index)
                .slice(i, i + 128);

            parameters[ name ].set(slicedRenderedBuffer);
        });

        try {
            const potentiallyEmptyInputs = inputs
                .map((input, index) => {
                    if (audioNodeConnections.inputs[index].size === 0) {
                        return input.map(() => new Float32Array());
                    }

                    return input;
                });
            const activeSourceFlag = audioWorkletProcessor.process(potentiallyEmptyInputs, outputs, parameters);

            for (let j = 0, outputChannelSplitterNodeOutput = 0; j < options.numberOfOutputs; j += 1) {
                for (let k = 0; k < options.outputChannelCount[j]; k += 1) {
                    // Bug #5: Safari does not support copyToChannel().
                    processedBuffer
                        .getChannelData(outputChannelSplitterNodeOutput + k)
                        .set(outputs[j][k], i);
                }

                outputChannelSplitterNodeOutput += options.outputChannelCount[j];
            }

            if (!activeSourceFlag) {
                break;
            }
        } catch (err) {
            if (proxy.onprocessorerror !== null) {
                proxy.onprocessorerror.call(<any> null, new ErrorEvent('processorerror'));
            }

            break;
        }
    }

    return processedBuffer;
};

export const createAudioWorkletNodeRendererFactory: TAudioWorkletNodeRendererFactoryFactory = (
    connectMultipleOutputs,
    createNativeAudioBufferSourceNode,
    createNativeChannelMergerNode,
    createNativeChannelSplitterNode,
    createNativeConstantSourceNode,
    createNativeGainNode,
    disconnectMultipleOutputs,
    nativeAudioWorkletNodeConstructor,
    nativeOfflineAudioContextConstructor,
    renderNativeOfflineAudioContext
) => {
    return (name, options, processorDefinition) => {
        let nativeNode: null | TNativeAudioBufferSourceNode | INativeAudioWorkletNode = null;

        return {
            render: async (
                proxy: IAudioWorkletNode,
                offlineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeAudioBufferSourceNode | INativeAudioWorkletNode> => {
                if (nativeNode !== null) {
                    return nativeNode;
                }

                nativeNode = <INativeAudioWorkletNode> getNativeNode(proxy);

                // Bug #61: Only Chrome Canary has an implementation of the AudioWorkletNode yet.
                if (nativeAudioWorkletNodeConstructor === null) {
                    if (processorDefinition === undefined) {
                        throw new Error('Missing the processor definition.');
                    }

                    if (nativeOfflineAudioContextConstructor === null) {
                        throw new Error('Missing the native (Offline)AudioContext constructor.');
                    }

                    // Bug #47: The AudioDestinationNode in Edge and Safari gets not initialized correctly.
                    const numberOfInputChannels = proxy.channelCount * proxy.numberOfInputs;
                    const numberOfParameters = processorDefinition.parameterDescriptors.length;
                    const partialOfflineAudioContext = new nativeOfflineAudioContextConstructor(
                        numberOfInputChannels + numberOfParameters,
                        // Ceil the length to the next full render quantum.
                        // Bug #17: Safari does not yet expose the length.
                        Math.ceil((<IMinimalOfflineAudioContext> proxy.context).length / 128) * 128,
                        offlineAudioContext.sampleRate
                    );
                    const gainNodes: TNativeGainNode[] = [ ];
                    const inputChannelSplitterNodes = [ ];

                    for (let i = 0; i < options.numberOfInputs; i += 1) {
                        gainNodes.push(createNativeGainNode(partialOfflineAudioContext, {
                            channelCount: options.channelCount,
                            channelCountMode: options.channelCountMode,
                            channelInterpretation: options.channelInterpretation,
                            gain: 1
                        }));
                        inputChannelSplitterNodes.push(createNativeChannelSplitterNode(partialOfflineAudioContext, {
                            numberOfOutputs: options.channelCount
                        }));
                    }

                    const constantSourceNodes = await Promise
                        .all(Array
                            .from(proxy.parameters.values())
                            .map(async (audioParam) => {
                                const constantSourceNode = createNativeConstantSourceNode(partialOfflineAudioContext, {
                                    channelCount: 1,
                                    channelCountMode: 'explicit',
                                    channelInterpretation: 'discrete',
                                    offset: audioParam.value
                                });

                                await renderAutomation(proxy.context, partialOfflineAudioContext, audioParam, constantSourceNode.offset);

                                return constantSourceNode;
                            }));

                    const inputChannelMergerNode = createNativeChannelMergerNode(partialOfflineAudioContext, {
                        numberOfInputs: Math.max(1, numberOfInputChannels + numberOfParameters)
                    });

                    for (let i = 0; i < options.numberOfInputs; i += 1) {
                        gainNodes[i].connect(inputChannelSplitterNodes[i]);

                        for (let j = 0; j < options.channelCount; j += 1) {
                            inputChannelSplitterNodes[i].connect(inputChannelMergerNode, j, (i * options.channelCount) + j);
                        }
                    }

                    for (const [ index, constantSourceNode ] of Array.from(constantSourceNodes.entries())) {
                        constantSourceNode.connect(inputChannelMergerNode, 0, numberOfInputChannels + index);
                        constantSourceNode.start(0);
                    }

                    inputChannelMergerNode.connect(partialOfflineAudioContext.destination);

                    return Promise
                        .all(gainNodes
                            .map((gainNode) => renderInputsOfAudioNode(proxy, partialOfflineAudioContext, gainNode)))
                        .then(() => renderNativeOfflineAudioContext(partialOfflineAudioContext))
                        .then(async (renderedBuffer) => {
                            const audioBufferSourceNode = createNativeAudioBufferSourceNode(offlineAudioContext);
                            const numberOfOutputChannels = options.outputChannelCount.reduce((sum, value) => sum + value, 0);
                            const outputChannelSplitterNode = createNativeChannelSplitterNode(offlineAudioContext, {
                                numberOfOutputs: Math.max(1, numberOfOutputChannels)
                            });
                            const outputChannelMergerNodes: TNativeChannelMergerNode[] = [ ];

                            for (let i = 0; i < proxy.numberOfOutputs; i += 1) {
                                outputChannelMergerNodes.push(createNativeChannelMergerNode(offlineAudioContext, {
                                   numberOfInputs: options.outputChannelCount[i]
                               }));
                            }

                            audioBufferSourceNode.buffer = processBuffer(
                                proxy,
                                renderedBuffer,
                                offlineAudioContext,
                                options,
                                processorDefinition
                            );
                            audioBufferSourceNode.connect(outputChannelSplitterNode);
                            audioBufferSourceNode.start(0);

                            for (let i = 0, outputChannelSplitterNodeOutput = 0; i < proxy.numberOfOutputs; i += 1) {
                                const outputChannelMergerNode = outputChannelMergerNodes[i];

                                for (let j = 0; j < options.outputChannelCount[i]; j += 1) {
                                    outputChannelSplitterNode.connect(outputChannelMergerNode, outputChannelSplitterNodeOutput + j, j);
                                }

                                outputChannelSplitterNodeOutput += options.outputChannelCount[i];
                            }

                            audioBufferSourceNode.connect = (...args: any[]) => {
                                return <any> connectMultipleOutputs(outputChannelMergerNodes, args[0], args[1], args[2]);
                            };
                            audioBufferSourceNode.disconnect = (...args: any[]) => {
                                return <any> disconnectMultipleOutputs(outputChannelMergerNodes, args[0], args[1], args[2]);
                            };

                            nativeNode = audioBufferSourceNode;

                            return nativeNode;
                        });
                }

                // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
                if (!isOwnedByContext(nativeNode, offlineAudioContext)) {
                    nativeNode = new nativeAudioWorkletNodeConstructor(offlineAudioContext, name);

                    // @todo Using Array.from() is a lazy fix that should not be necessary forever.
                    for (const [ nm, audioParam ] of Array.from(proxy.parameters.entries())) {
                        await renderAutomation(
                            proxy.context,
                            offlineAudioContext,
                            audioParam,
                            <TNativeAudioParam> nativeNode.parameters.get(nm)
                        );
                    }
                } else {
                    // @todo Using Array.from() is a lazy fix that should not be necessary forever.
                    for (const [ nm, audioParam ] of Array.from(proxy.parameters.entries())) {
                        await connectAudioParam(
                            proxy.context,
                            offlineAudioContext,
                            audioParam,
                            <TNativeAudioParam> nativeNode.parameters.get(nm)
                        );
                    }
                }

                await renderInputsOfAudioNode(proxy, offlineAudioContext, nativeNode);

                return nativeNode;
            }
        };
    };
};
