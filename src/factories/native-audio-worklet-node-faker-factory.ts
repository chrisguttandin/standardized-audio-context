import { createAudioWorkletProcessor } from '../helpers/create-audio-worklet-processor';
import { createNestedArrays } from '../helpers/create-nested-arrays';
import { getAudioNodeConnections } from '../helpers/get-audio-node-connections';
import { IAudioWorkletProcessor, INativeAudioWorkletNode, INativeConstantSourceNode } from '../interfaces';
import { ReadOnlyMap } from '../read-only-map';
import {
    TNativeAudioParam,
    TNativeAudioWorkletNodeFakerFactoryFactory,
    TNativeChannelMergerNode,
    TNativeGainNode,
    TProcessorErrorEventHandler
} from '../types';

export const createNativeAudioWorkletNodeFakerFactory: TNativeAudioWorkletNodeFakerFactoryFactory = (
    connectMultipleOutputs,
    createIndexSizeError,
    createInvalidStateError,
    createNativeChannelMergerNode,
    createNativeChannelSplitterNode,
    createNativeConstantSourceNode,
    createNativeGainNode,
    createNotSupportedError,
    disconnectMultipleOutputs
) => {
    return (nativeAudioContext, processorDefinition, options) => {
        if (options.numberOfInputs === 0 && options.numberOfOutputs === 0) {
            throw createNotSupportedError();
        }

        if (options.outputChannelCount !== undefined) {
            if (options.outputChannelCount.length !== options.numberOfOutputs) {
                throw createIndexSizeError();
            }

            // @todo Check if any of the channelCount values is greater than the implementation's maximum number of channels.
            if (options.outputChannelCount.some((channelCount) => (channelCount < 1))) {
                throw createNotSupportedError();
            }
        }

        // Bug #61: This is not part of the standard but required for the faker to work.
        if (options.channelCountMode !== 'explicit') {
            throw createNotSupportedError();
        }

        const numberOfInputChannels = options.channelCount * options.numberOfInputs;
        const numberOfOutputChannels = options.outputChannelCount.reduce((sum, value) => sum + value, 0);
        const numberOfParameters = processorDefinition.parameterDescriptors.length;

        // Bug #61: This is not part of the standard but required for the faker to work.
        if (numberOfInputChannels + numberOfParameters > 6 || numberOfOutputChannels > 6) {
            throw createNotSupportedError();
        }

        const messageChannel = new MessageChannel();
        const gainNodes: TNativeGainNode[] = [ ];
        const inputChannelSplitterNodes = [ ];

        for (let i = 0; i < options.numberOfInputs; i += 1) {
            gainNodes.push(createNativeGainNode(nativeAudioContext, {
                channelCount: options.channelCount,
                channelCountMode: options.channelCountMode,
                channelInterpretation: options.channelInterpretation,
                gain: 1
            }));
            inputChannelSplitterNodes.push(createNativeChannelSplitterNode(nativeAudioContext, {
                channelCount: options.channelCount,
                channelCountMode: 'explicit',
                channelInterpretation: 'discrete',
                numberOfOutputs: options.channelCount
            }));
        }

        const constantSourceNodes: INativeConstantSourceNode[] = [ ];

        for (const { defaultValue, maxValue, minValue } of processorDefinition.parameterDescriptors) {
            const constantSourceNode = createNativeConstantSourceNode(nativeAudioContext, {
                channelCount: 1,
                channelCountMode: 'explicit',
                channelInterpretation: 'discrete',
                offset: (defaultValue === undefined) ? 0 : defaultValue
            });

            Object.defineProperties(constantSourceNode.offset, {
                defaultValue: {
                    get: () => (defaultValue === undefined) ? 0 : defaultValue
                },
                maxValue: {
                    get: () => (maxValue === undefined) ? 3.4028234663852886e38 : maxValue
                },
                minValue: {
                    get: () => (minValue === undefined) ? -3.4028234663852886e38 : minValue
                }
            });

            constantSourceNodes.push(constantSourceNode);
        }

        const inputChannelMergerNode = createNativeChannelMergerNode(nativeAudioContext, {
            numberOfInputs: Math.max(1, numberOfInputChannels + numberOfParameters)
        });
        const bufferSize = 512;
        const scriptProcessorNode = nativeAudioContext.createScriptProcessor(
            bufferSize,
            numberOfInputChannels + numberOfParameters,
            // Bug #87: Only Firefox will fire an AudioProcessingEvent if there is no connected output.
            Math.max(1, numberOfOutputChannels)
        );
        const outputChannelSplitterNode = createNativeChannelSplitterNode(nativeAudioContext, {
            channelCount: Math.max(1, numberOfOutputChannels),
            channelCountMode: 'explicit',
            channelInterpretation: 'discrete',
            numberOfOutputs: Math.max(1, numberOfOutputChannels)
        });
        const outputChannelMergerNodes: TNativeChannelMergerNode[] = [ ];

        for (let i = 0; i < options.numberOfOutputs; i += 1) {
            outputChannelMergerNodes.push(createNativeChannelMergerNode(nativeAudioContext, {
               numberOfInputs: options.outputChannelCount[i]
           }));
        }

        for (let i = 0; i < options.numberOfInputs; i += 1) {
            gainNodes[i].connect(inputChannelSplitterNodes[i]);

            for (let j = 0; j < options.channelCount; j += 1) {
                inputChannelSplitterNodes[i].connect(inputChannelMergerNode, j, (i * options.channelCount) + j);
            }
        }

        const parameterMap = new ReadOnlyMap(
            processorDefinition.parameterDescriptors
                .map(({ name }, index) => {
                    const constantSourceNode = constantSourceNodes[index];

                    constantSourceNode.connect(inputChannelMergerNode, 0, numberOfInputChannels + index);
                    constantSourceNode.start(0);

                    return <[ string, TNativeAudioParam ]> [ name, constantSourceNode.offset ];
                }));

        inputChannelMergerNode.connect(scriptProcessorNode);

        if (options.numberOfOutputs > 0) {
            scriptProcessorNode.connect(outputChannelSplitterNode);
        }

        for (let i = 0, outputChannelSplitterNodeOutput = 0; i < options.numberOfOutputs; i += 1) {
            const outputChannelMergerNode = outputChannelMergerNodes[i];

            for (let j = 0; j < options.outputChannelCount[i]; j += 1) {
                outputChannelSplitterNode.connect(outputChannelMergerNode, outputChannelSplitterNodeOutput + j, j);
            }

            outputChannelSplitterNodeOutput += options.outputChannelCount[i];
        }

        let onprocessorerror: null | TProcessorErrorEventHandler = null;

        // Bug #87: Expose at least one output to make this node connectable.
        const outputAudioNodes = (options.numberOfOutputs === 0) ? [ scriptProcessorNode ] : outputChannelMergerNodes;
        const faker = {
            get bufferSize () {
                return bufferSize;
            },
            get channelCount () {
                return options.channelCount;
            },
            set channelCount (_) {
                // Bug #61: This is not part of the standard but required for the faker to work.
                throw createInvalidStateError();
            },
            get channelCountMode () {
                return options.channelCountMode;
            },
            set channelCountMode (_) {
                // Bug #61: This is not part of the standard but required for the faker to work.
                throw createInvalidStateError();
            },
            get channelInterpretation () {
                return gainNodes[0].channelInterpretation;
            },
            set channelInterpretation (value) {
                for (const gainNode of gainNodes) {
                    gainNode.channelInterpretation = value;
                }
            },
            get context () {
                return gainNodes[0].context;
            },
            get inputs () {
                return gainNodes;
            },
            get numberOfInputs () {
                return options.numberOfInputs;
            },
            get numberOfOutputs () {
                return options.numberOfOutputs;
            },
            get onprocessorerror () {
                return <INativeAudioWorkletNode['onprocessorerror']> onprocessorerror;
            },
            set onprocessorerror (value) {
                if (value === null || typeof value === 'function') {
                    onprocessorerror = <any> value;
                } else {
                    onprocessorerror = null;
                }
            },
            get parameters () {
                return parameterMap;
            },
            get port () {
                return messageChannel.port2;
            },
            addEventListener (...args: any[]) {
                return gainNodes[0].addEventListener(args[0], args[1], args[2]);
            },
            connect (...args: any[]) {
                return <any> connectMultipleOutputs(outputAudioNodes, args[0], args[1], args[2]);
            },
            disconnect (...args: any[]) {
                return <any> disconnectMultipleOutputs(outputAudioNodes, args[0], args[1], args[2]);
            },
            dispatchEvent (...args: any[]) {
                return gainNodes[0].dispatchEvent(args[0]);
            },
            removeEventListener (...args: any[]) {
                return gainNodes[0].removeEventListener(args[0], args[1], args[2]);
            }
        };

        processorDefinition.prototype.port = messageChannel.port1;

        let audioWorkletProcessor: null | IAudioWorkletProcessor = null;

        const audioWorkletProcessorPromise = createAudioWorkletProcessor(nativeAudioContext, faker, processorDefinition, options);

        audioWorkletProcessorPromise
            .then((dWrkltPrcssr) => audioWorkletProcessor = dWrkltPrcssr);

        const inputs = createNestedArrays(options.numberOfInputs, options.channelCount);
        const outputs = createNestedArrays(options.numberOfOutputs, options.outputChannelCount);
        const parameters: { [ name: string ]: Float32Array } = processorDefinition.parameterDescriptors
            .reduce((prmtrs, { name }) => ({ ...prmtrs, [ name ]: new Float32Array(128) }), { });

        let isActive = true;

        scriptProcessorNode.onaudioprocess = ({ inputBuffer, outputBuffer }: AudioProcessingEvent) => {
            if (audioWorkletProcessor !== null) {
                for (let i = 0; i < bufferSize; i += 128) {
                    for (let j = 0; j < options.numberOfInputs; j += 1) {
                        for (let k = 0; k < options.channelCount; k += 1) {
                            // Bug #5: Safari does not support copyFromChannel().
                            const slicedInputBuffer = inputBuffer
                                .getChannelData(k)
                                .slice(i, i + 128);

                            inputs[j][k].set(slicedInputBuffer);
                        }
                    }

                    processorDefinition.parameterDescriptors.forEach(({ name }, index) => {
                        const slicedInputBuffer = inputBuffer
                            .getChannelData(numberOfInputChannels + index)
                            .slice(i, i + 128);

                        parameters[ name ].set(slicedInputBuffer);
                    });

                    try {
                        const audioNodeConnections = getAudioNodeConnections(faker);
                        const potentiallyEmptyInputs = inputs
                            .map((input, index) => {
                                if (audioNodeConnections.inputs[index].size === 0) {
                                    return [ ];
                                }

                                return input;
                            });
                        const activeSourceFlag = audioWorkletProcessor.process(potentiallyEmptyInputs, outputs, parameters);

                        isActive = activeSourceFlag;

                        for (let j = 0, outputChannelSplitterNodeOutput = 0; j < options.numberOfOutputs; j += 1) {
                            for (let k = 0; k < options.outputChannelCount[j]; k += 1) {
                                // Bug #5: Safari does not support copyFromChannel().
                                outputBuffer
                                    .getChannelData(outputChannelSplitterNodeOutput + k)
                                    .set(outputs[j][k], i);
                            }

                            outputChannelSplitterNodeOutput += options.outputChannelCount[j];
                        }
                    } catch (err) {
                        isActive = false;

                        if (onprocessorerror !== null) {
                            onprocessorerror.call(<any> null, new ErrorEvent('processorerror'));
                        }
                    }

                    if (!isActive) {
                        scriptProcessorNode.onaudioprocess = <any> null;

                        break;
                    }
                }
            }
        };

        return faker;
    };
};
