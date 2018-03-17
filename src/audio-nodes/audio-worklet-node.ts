import { Injector } from '@angular/core';
import { NOT_SUPPORTED_ERROR_FACTORY_PROVIDER, NotSupportedErrorFactory } from '../factories/not-supported-error';
import { AUDIO_WORKLET_NODE_FAKER_PROVIDER, AudioWorkletNodeFaker } from '../fakers/audio-worklet-node';
import { AUDIO_NODE_RENDERER_STORE, NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS } from '../globals';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import {
    IAudioParamMap,
    IAudioWorkletNode,
    IAudioWorkletNodeOptions,
    IMinimalBaseAudioContext,
    INativeAudioWorkletNode
} from '../interfaces';
import {
    NATIVE_AUDIO_WORKLET_NODE_CONSTRUCTOR_PROVIDER,
    nativeAudioWorkletNodeConstructor as ntvDWrkltNdCnstrctr
} from '../providers/native-audio-worklet-node-constructor';
import { WINDOW_PROVIDER } from '../providers/window';
import { AudioWorkletNodeRenderer } from '../renderers/audio-worklet-node';
import {
    TChannelCountMode,
    TChannelInterpretation,
    TUnpatchedAudioContext,
    TUnpatchedOfflineAudioContext
} from '../types';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const DEFAULT_OPTIONS: IAudioWorkletNodeOptions = {
    channelCount: 2,
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    numberOfInputs: 1,
    numberOfOutputs: 1
};

const injector = Injector.create({
    providers: [
        AUDIO_WORKLET_NODE_FAKER_PROVIDER,
        NATIVE_AUDIO_WORKLET_NODE_CONSTRUCTOR_PROVIDER,
        NOT_SUPPORTED_ERROR_FACTORY_PROVIDER,
        WINDOW_PROVIDER
    ]
});

const audioWorkletNodeFaker = injector.get(AudioWorkletNodeFaker);
const nativeAudioWorkletNodeConstructor = injector.get(ntvDWrkltNdCnstrctr);
const notSupportedErrorFactory = injector.get(NotSupportedErrorFactory);

const createNativeAudioWorkletNode = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    name: string,
    options: IAudioWorkletNodeOptions
) => {
    if (nativeAudioWorkletNodeConstructor !== null) {
        try {
            return new nativeAudioWorkletNodeConstructor(nativeContext, name, options);
        } catch (err) {
            // Bug #60: Chrome Canary throws an InvalidStateError instead of a NotSupportedError.
            if (err.code === 11 && nativeContext.state !== 'closed') {
                throw notSupportedErrorFactory.create();
            }

            throw err;
        }
    }

    // Bug #61: Only Chrome Canary has an implementation of the AudioWorkletNode yet.
    if (isOfflineAudioContext(nativeContext)) {
        return null;
    } else {
        return <INativeAudioWorkletNode> (<any> audioWorkletNodeFaker.fake(nativeContext, options));
    }
};

export class AudioWorkletNode extends NoneAudioDestinationNode<INativeAudioWorkletNode> implements IAudioWorkletNode {

    private _parameters: null | IAudioParamMap;

    private _port: null | MessagePort;

    constructor (context: IMinimalBaseAudioContext, name: string, options: IAudioWorkletNodeOptions = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IAudioWorkletNodeOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = createNativeAudioWorkletNode(nativeContext, name, mergedOptions);

        if (nativeAudioWorkletNodeConstructor === null) {
            const nodeNameToProcessorDefinitionMap = NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS.get(nativeContext);

            if (nodeNameToProcessorDefinitionMap === undefined || !nodeNameToProcessorDefinitionMap.has(name)) {
                throw notSupportedErrorFactory.create();
            }
        }

        super(context, nativeNode, mergedOptions);

        // @todo Implement a readonly AudioParamMap. Test parameters support with an expectation test.
        this._parameters = (nativeNode === null || nativeNode.parameters === undefined) ? new Map() : null;
        // @todo Test port support with an expectation test.
        this._port = (nativeNode === null || nativeNode.port === undefined) ? (new MessageChannel()).port1 : null;

        if (isOfflineAudioContext(nativeContext)) {
            const audioWorkletNodeRenderer = new AudioWorkletNodeRenderer(this, name/* @todo options */);

            AUDIO_NODE_RENDERER_STORE.set(this, audioWorkletNodeRenderer);
        }
    }

    get onprocessorstatechange () {
        // @todo No browser does implement the processorState property yet.
        return null;
    }

    set onprocessorstatechange (value) {
        if (this._nativeNode === null) {
            // @todo
        } else {
            this._nativeNode.onprocessorstatechange = <any> value;
        }
    }

    get parameters () {
        if (this._parameters === null) {
            if (this._nativeNode === null) {
                throw new Error('The associated nativeNode is missing.');
            }

            return <IAudioParamMap> (<any> this._nativeNode.parameters);
        }

        return this._parameters;
    }

    get port () {
        if (this._port === null) {
            if (this._nativeNode === null) {
                throw new Error('The associated nativeNode is missing.');
            }

            return this._nativeNode.port;
        }

        return this._port;
    }

    get processorState () {
        if (this._nativeNode === null) {
            return 'pending';
        }

        // @todo Chrome Canary does not implement the processorState property.
        if (this._nativeNode.processorState === undefined) {
            return 'pending';
        }

        // @todo This is currently dead code since no browser supports this.
        return this._nativeNode.processorState;
    }

}
