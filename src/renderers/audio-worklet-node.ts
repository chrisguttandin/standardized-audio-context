import { Injector } from '@angular/core';
import { connectAudioParam } from '../helpers/connect-audio-param';
import { connectMultipleOutputs } from '../helpers/connect-multiple-outputs';
import { createNativeAudioBufferSourceNode } from '../helpers/create-native-audio-buffer-source-node';
import { createNativeChannelMergerNode } from '../helpers/create-native-channel-merger-node';
import { createNativeChannelSplitterNode } from '../helpers/create-native-channel-splitter-node';
import { createNativeConstantSourceNode } from '../helpers/create-native-constant-source-node';
import { createNativeGainNode } from '../helpers/create-native-gain-node';
import { createNestedArrays } from '../helpers/create-nested-arrays';
import { disconnectMultipleOutputs } from '../helpers/disconnect-multiple-outputs';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { renderNativeOfflineAudioContext } from '../helpers/render-native-offline-audio-context';
import {
    IAudioWorkletNode,
    IAudioWorkletNodeOptions,
    IAudioWorkletProcessorConstructor,
    IMinimalOfflineAudioContext,
    INativeAudioWorkletNode
} from '../interfaces';
import {
    NATIVE_AUDIO_WORKLET_NODE_CONSTRUCTOR_PROVIDER,
    nativeAudioWorkletNodeConstructor as ntvDWrkltNdCnstrctr
} from '../providers/native-audio-worklet-node-constructor';
import {
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    unpatchedOfflineAudioContextConstructor as nptchdFflnDCntxtCnstrctr
} from '../providers/unpatched-offline-audio-context-constructor';
import { WINDOW_PROVIDER } from '../providers/window';
import {
    TNativeAudioBuffer,
    TNativeAudioBufferSourceNode,
    TNativeAudioNode,
    TNativeAudioParam,
    TNativeChannelMergerNode,
    TNativeGainNode,
    TUnpatchedOfflineAudioContext
} from '../types';
import { AudioNodeRenderer } from './audio-node';

const injector = Injector.create({
    providers: [
        NATIVE_AUDIO_WORKLET_NODE_CONSTRUCTOR_PROVIDER,
        UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
        WINDOW_PROVIDER
    ]
});

const nativeAudioWorkletNodeConstructor = injector.get(ntvDWrkltNdCnstrctr);
const unpatchedOfflineAudioContextConstructor = injector.get(nptchdFflnDCntxtCnstrctr);

export class AudioWorkletNodeRenderer extends AudioNodeRenderer {

    private _name: string;

    private _nativeNode: null | TNativeAudioBufferSourceNode | INativeAudioWorkletNode;

    private _options: { outputChannelCount: number[] } & IAudioWorkletNodeOptions;

    private _processorDefinition: undefined | IAudioWorkletProcessorConstructor;

    private _proxy: IAudioWorkletNode;

    constructor (
        proxy: IAudioWorkletNode,
        name: string,
        options: { outputChannelCount: number[] } & IAudioWorkletNodeOptions,
        processorDefinition: undefined | IAudioWorkletProcessorConstructor
    ) {
        super();

        this._name = name;
        this._nativeNode = null;
        this._options = options;
        this._processorDefinition = processorDefinition;
        this._proxy = proxy;
    }

    public async render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode> {
        if (this._nativeNode !== null) {
            return this._nativeNode;
        }

        const nativeNode = <INativeAudioWorkletNode> getNativeNode(this._proxy);

        // Bug #61: Only Chrome Canary has an implementation of the AudioWorkletNode yet.
        if (nativeAudioWorkletNodeConstructor === null) {
            if (this._processorDefinition === undefined) {
                throw new Error('Missing the processor definition.');
            }

            if (unpatchedOfflineAudioContextConstructor === null) {
                throw new Error('Missing the native (Offline)AudioContext constructor.');
            }

            // Bug #47: The AudioDestinationNode in Edge and Safari gets not initialized correctly.
            const numberOfInputChannels = this._proxy.channelCount * this._proxy.numberOfInputs;
            const numberOfParameters = this._processorDefinition.parameterDescriptors.length;
            const partialOfflineAudioContext = new unpatchedOfflineAudioContextConstructor(
                numberOfInputChannels + numberOfParameters,
                // Bug #17: Safari does not yet expose the length.
                (<IMinimalOfflineAudioContext> this._proxy.context).length,
                offlineAudioContext.sampleRate
            );
            const gainNodes: TNativeGainNode[] = [ ];
            const inputChannelSplitterNodes = [ ];

            for (let i = 0; i < this._options.numberOfInputs; i += 1) {
                gainNodes.push(createNativeGainNode(partialOfflineAudioContext, this._options));
                inputChannelSplitterNodes.push(createNativeChannelSplitterNode(partialOfflineAudioContext, {
                    numberOfOutputs: this._options.channelCount
                }));
            }

            const constantSourceNodes = await Promise
                .all(Array
                    .from(this._proxy.parameters.values())
                    .map(async (audioParam) => {
                        // @todo Support defaultValue = 0, maxValue = 3.4028235e38 and minValue = -3.4028235e38.
                        const constantSourceNode = createNativeConstantSourceNode(partialOfflineAudioContext);

                        await renderAutomation(partialOfflineAudioContext, audioParam, constantSourceNode.offset);

                        return constantSourceNode;
                    }));

            const inputChannelMergerNode = createNativeChannelMergerNode(partialOfflineAudioContext, {
                numberOfInputs: Math.max(1, numberOfInputChannels + numberOfParameters)
            });

            for (let i = 0; i < this._options.numberOfInputs; i += 1) {
                gainNodes[i].connect(inputChannelSplitterNodes[i]);

                for (let j = 0; j < this._options.channelCount; j += 1) {
                    inputChannelSplitterNodes[i].connect(inputChannelMergerNode, j, (i * this._options.channelCount) + j);
                }
            }

            for (const [ index, constantSourceNode ] of Array.from(constantSourceNodes.entries())) {
                constantSourceNode.connect(inputChannelMergerNode, 0, numberOfInputChannels + index);
                constantSourceNode.start(0);
            }

            inputChannelMergerNode.connect(partialOfflineAudioContext.destination);

            return Promise
                .all(gainNodes
                    .map((gainNode) => this
                        ._connectSources(partialOfflineAudioContext, gainNode)))
                .then(() => renderNativeOfflineAudioContext(partialOfflineAudioContext))
                .then(async (renderedBuffer) => {
                    const audioBufferSourceNode = createNativeAudioBufferSourceNode(offlineAudioContext);
                    const numberOfOutputChannels = this._options.outputChannelCount.reduce((sum, value) => sum + value, 0);
                    const outputChannelSplitterNode = createNativeChannelSplitterNode(offlineAudioContext, {
                        numberOfOutputs: Math.max(1, numberOfOutputChannels)
                    });
                    const outputChannelMergerNodes: TNativeChannelMergerNode[] = [ ];

                    for (let i = 0; i < this._proxy.numberOfOutputs; i += 1) {
                        outputChannelMergerNodes.push(createNativeChannelMergerNode(offlineAudioContext, {
                           numberOfInputs: this._options.outputChannelCount[i]
                       }));
                    }

                    audioBufferSourceNode.buffer = this._processBuffer(renderedBuffer, offlineAudioContext);
                    audioBufferSourceNode.connect(outputChannelSplitterNode);
                    audioBufferSourceNode.start(0);

                    for (let i = 0, outputChannelSplitterNodeOutput = 0; i < this._proxy.numberOfOutputs; i += 1) {
                        const outputChannelMergerNode = outputChannelMergerNodes[i];

                        for (let j = 0; j < this._options.outputChannelCount[i]; j += 1) {
                            outputChannelSplitterNode.connect(outputChannelMergerNode, outputChannelSplitterNodeOutput + j, j);
                        }

                        outputChannelSplitterNodeOutput += this._options.outputChannelCount[i];
                    }

                    audioBufferSourceNode.connect = (...args: any[]) => {
                        return <any> connectMultipleOutputs(outputChannelMergerNodes, args[0], args[1], args[2]);
                    };
                    audioBufferSourceNode.disconnect = (...args: any[]) => {
                        return <any> disconnectMultipleOutputs(outputChannelMergerNodes, args[0], args[1], args[2]);
                    };

                    this._nativeNode = audioBufferSourceNode;

                    return <TNativeAudioNode> this._nativeNode;
                });
        }

        // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
        if (!isOwnedByContext(nativeNode, offlineAudioContext)) {
            this._nativeNode = new nativeAudioWorkletNodeConstructor(offlineAudioContext, this._name);

            // @todo Using Array.from() is a lazy fix that should not be necessary forever.
            for (const [ name, audioParam ] of Array.from(this._proxy.parameters.entries())) {
                await renderAutomation(offlineAudioContext, audioParam, <TNativeAudioParam> this._nativeNode.parameters.get(name));
            }
        } else {
            this._nativeNode = nativeNode;

            // @todo Using Array.from() is a lazy fix that should not be necessary forever.
            for (const [ name, audioParam ] of Array.from(this._proxy.parameters.entries())) {
                await connectAudioParam(offlineAudioContext, audioParam, <TNativeAudioParam> this._nativeNode.parameters.get(name));
            }
        }

        return this
            ._connectSources(offlineAudioContext, <TNativeAudioNode> this._nativeNode)
            .then(() => <TNativeAudioNode> this._nativeNode);
    }

    private _processBuffer (
        renderedBuffer: TNativeAudioBuffer,
        offlineAudioContext: TUnpatchedOfflineAudioContext
    ): TNativeAudioBuffer {
        const { length } = renderedBuffer;
        const numberOfInputChannels = this._options.channelCount * this._options.numberOfInputs;
        const numberOfOutputChannels = this._options.outputChannelCount.reduce((sum, value) => sum + value, 0);
        const processedBuffer = offlineAudioContext.createBuffer(
            numberOfOutputChannels,
            length,
            renderedBuffer.sampleRate
        );

        if (this._processorDefinition === undefined) {
            throw new Error();
        }

        const audioWorkletProcessor = new this._processorDefinition(this._options);

        const inputs = createNestedArrays(this._options.numberOfInputs, this._options.channelCount);
        const outputs = createNestedArrays(this._options.numberOfInputs, this._options.outputChannelCount);
        const parameters: { [ name: string ]: Float32Array } = Array
            .from(this._proxy.parameters.keys())
            .reduce((prmtrs, name, index) => {
                return { ...prmtrs, [ name ]: renderedBuffer.getChannelData(numberOfInputChannels + index) };
            }, { });

        for (let i = 0; i < length; i += 128) {
            for (let j = 0; j < this._options.numberOfInputs; j += 1) {
                for (let k = 0; k < this._options.channelCount; k += 1) {
                    // Bug #5: Safari does not support copyFromChannel().
                    const slicedRenderedBuffer = renderedBuffer
                        .getChannelData(k)
                        .slice(i, i + 128);

                    inputs[j][k].set(slicedRenderedBuffer);
                }
            }

            this._processorDefinition.parameterDescriptors.forEach(({ name }, index) => {
                const slicedRenderedBuffer = renderedBuffer
                    .getChannelData(numberOfInputChannels + index)
                    .slice(i, i + 128);

                parameters[ name ].set(slicedRenderedBuffer);
            });

            try {
                const activeSourceFlag = audioWorkletProcessor.process(inputs, outputs, parameters);

                for (let j = 0, outputChannelSplitterNodeOutput = 0; j < this._options.numberOfOutputs; j += 1) {
                    for (let k = 0; k < this._options.outputChannelCount[j]; k += 1) {
                        // Bug #5: Safari does not support copyToChannel().
                        if (i + 128 <= length) {
                            processedBuffer
                                .getChannelData(outputChannelSplitterNodeOutput + k)
                                .set(outputs[j][k], i);
                        } else {
                            processedBuffer
                                .getChannelData(outputChannelSplitterNodeOutput + k)
                                .set(outputs[j][k].slice(0, length % 128), i);
                        }
                    }

                    outputChannelSplitterNodeOutput += this._options.outputChannelCount[j];
                }

                if (!activeSourceFlag) {
                    break;
                }
            } catch (err) {
                if (this._proxy.onprocessorerror !== null) {
                    this._proxy.onprocessorerror.call(<any> null, new ErrorEvent('processorerror'));
                }

                break;
            }
        }

        return processedBuffer;
    }

}
