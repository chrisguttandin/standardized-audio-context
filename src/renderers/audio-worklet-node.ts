import { Injector } from '@angular/core';
import { connectAudioParam } from '../helpers/connect-audio-param';
import { createNativeConstantSourceNode } from '../helpers/create-native-constant-source-node';
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

    private _options: IAudioWorkletNodeOptions;

    private _processorDefinition: undefined | IAudioWorkletProcessorConstructor;

    private _proxy: IAudioWorkletNode;

    constructor (
        proxy: IAudioWorkletNode,
        name: string,
        options: IAudioWorkletNodeOptions,
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
        if (unpatchedOfflineAudioContextConstructor === null) {
            throw new Error(); // @todo
        }

        if (this._nativeNode !== null) {
            return this._nativeNode;
        }

        try {
            // Throw an error if the native constructor is not supported.
            // @todo Use a simple if clause instead of throwing an error.
            if (nativeAudioWorkletNodeConstructor === null) {
                throw new Error();
            }

            this._nativeNode = <INativeAudioWorkletNode> getNativeNode(this._proxy);

            // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
            if (!isOwnedByContext(this._nativeNode, offlineAudioContext)) {
                this._nativeNode = new nativeAudioWorkletNodeConstructor(offlineAudioContext, this._name);

                // @todo Using Array.from() is a lazy fix that should not be necessary forever.
                for (const [ name, audioParam ] of Array.from(this._proxy.parameters.entries())) {
                    await renderAutomation(offlineAudioContext, audioParam, <TNativeAudioParam> this._nativeNode.parameters.get(name));
                }
            } else {
                // @todo Using Array.from() is a lazy fix that should not be necessary forever.
                for (const [ name, audioParam ] of Array.from(this._proxy.parameters.entries())) {
                    await connectAudioParam(offlineAudioContext, audioParam, <TNativeAudioParam> this._nativeNode.parameters.get(name));
                }
            }

            return this
                ._connectSources(offlineAudioContext, <TNativeAudioNode> this._nativeNode)
                .then(() => <TNativeAudioNode> this._nativeNode);

        // Bug #61: Only Chrome Canary has an implementation of the AudioWorkletNode yet.
        } catch (err) {
            if (this._processorDefinition === undefined) {
                throw new Error();
            }
            // Bug #47: The AudioDestinationNode in Edge and Safari gets not initialized correctly.
            const numberOfChannels = (<IMinimalOfflineAudioContext> this._proxy.context).destination.channelCount;
            const numberOfParameters = this._processorDefinition.parameterDescriptors.length;
            const partialOfflineAudioContext = new unpatchedOfflineAudioContextConstructor(
                numberOfChannels + numberOfParameters,
                // Bug #17: Safari does not yet expose the length.
                (<IMinimalOfflineAudioContext> this._proxy.context).length,
                offlineAudioContext.sampleRate
            );
            const channelSplitterNode = partialOfflineAudioContext.createChannelSplitter(numberOfChannels);
            // @todo Create multiple ChannelMergerNodes to support more than (6 - numberOfChannels) parameters.
            const channelMergerNode = partialOfflineAudioContext.createChannelMerger(numberOfChannels + numberOfParameters);

            for (let i = 0; i < numberOfChannels; i += 1) {
                channelSplitterNode.connect(channelMergerNode, i, i);
            }

            await Promise
                .all(Array
                    .from(this._proxy.parameters.values())
                    .map(async (audioParam, index) => {
                        // @todo Support defaultValue = 0, maxValue = 3.4028235e38 and minValue = -3.4028235e38.

                        const constantSourceNode = createNativeConstantSourceNode(partialOfflineAudioContext);
                        await renderAutomation(partialOfflineAudioContext, audioParam, constantSourceNode.offset);

                        constantSourceNode.connect(channelMergerNode, 0, numberOfChannels + index);
                        constantSourceNode.start(0);
                    }));

            channelMergerNode.connect(partialOfflineAudioContext.destination);

            return this
                ._connectSources(partialOfflineAudioContext, <TNativeAudioNode> channelSplitterNode)
                .then(() => renderNativeOfflineAudioContext(partialOfflineAudioContext))
                .then(async (renderedBuffer) => {
                    const parameters: { [ name: string ]: Float32Array } = Array
                        .from(this._proxy.parameters.keys())
                        .reduce((prmtrs, name, index) => {
                            return { ...prmtrs, [ name ]: renderedBuffer.getChannelData(numberOfChannels + index) };
                        }, { });

                    const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                    audioBufferSourceNode.buffer = this._processBuffer(renderedBuffer, offlineAudioContext, numberOfChannels, parameters);
                    audioBufferSourceNode.start(0);

                    this._nativeNode = audioBufferSourceNode;

                    return <TNativeAudioNode> this._nativeNode;
                });
        }
    }

    private _processBuffer (
        renderedBuffer: TNativeAudioBuffer,
        offlineAudioContext: TUnpatchedOfflineAudioContext,
        numberOfChannels: number,
        parameters: { [ name: string ]: Float32Array }
    ): TNativeAudioBuffer {
        const { length } = renderedBuffer;
        const processedBuffer = offlineAudioContext.createBuffer(
            numberOfChannels,
            length,
            renderedBuffer.sampleRate
        );

        if (this._processorDefinition === undefined) {
            throw new Error();
        }

        const audioWorkletProcessor = new this._processorDefinition(this._options);

        const inputs = [ ];
        const outputs = [ ];

        // @todo Handle multiple inputs and/or outputs ...
        const input = [ ];
        const output = [ ];

        for (let i = 0; i < numberOfChannels; i += 1) {
            input.push(new Float32Array(128));
            output.push(new Float32Array(128));
        }

        inputs.push(input);
        outputs.push(output);

        for (let i = 0; i < length; i += 128) {
            // @todo Handle multiple inputs ...
            for (let j = 0; j < numberOfChannels; j += 1) {
                // Bug #5: Safari does not support copyFromChannel().
                const slicedRenderedBuffer = renderedBuffer
                    .getChannelData(j)
                    .slice(i, i + 128);

                inputs[0][j].set(slicedRenderedBuffer);
            }

            // @todo slice the parameters ...

            try {
                const activeSourceFlag = audioWorkletProcessor.process(inputs, outputs, parameters);

                if (!activeSourceFlag) {
                    break;
                }
            } catch (err) {
                if (this._proxy.onprocessorerror !== null) {
                    this._proxy.onprocessorerror.call(<any> null, new ErrorEvent('processorerror'));
                }

                break;
            }

            // @todo Handle multiple outputs ...
            for (let j = 0; j < numberOfChannels; j += 1) {
                // Bug #5: Safari does not support copyToChannel().
                if (i + 128 <= length) {
                    processedBuffer
                        .getChannelData(j)
                        .set(outputs[0][j], i);
                } else {
                    processedBuffer
                        .getChannelData(j)
                        .set(outputs[0][j].slice(0, length % 128), i);
                }
            }
        }

        return processedBuffer;
    }

}
