import { Injector } from '@angular/core';
import { AudioParam } from '../audio-param';
import { INVALID_STATE_ERROR_FACTORY_PROVIDER } from '../factories/invalid-state-error';
import { NOT_SUPPORTED_ERROR_FACTORY_PROVIDER, NotSupportedErrorFactory } from '../factories/not-supported-error';
import { AUDIO_WORKLET_NODE_FAKER_PROVIDER, AudioWorkletNodeFaker } from '../fakers/audio-worklet-node';
import { CONSTANT_SOURCE_NODE_FAKER_PROVIDER } from '../fakers/constant-source-node';
import { AUDIO_NODE_RENDERER_STORE, AUDIO_PARAM_RENDERER_STORE, NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS } from '../globals';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import {
    IAudioParam,
    IAudioWorkletNode,
    IAudioWorkletNodeOptions,
    IAudioWorkletProcessorConstructor,
    IMinimalBaseAudioContext,
    INativeAudioWorkletNode
} from '../interfaces';
import {
    NATIVE_AUDIO_WORKLET_NODE_CONSTRUCTOR_PROVIDER,
    nativeAudioWorkletNodeConstructor as ntvDWrkltNdCnstrctr
} from '../providers/native-audio-worklet-node-constructor';
import { WINDOW_PROVIDER } from '../providers/window';
import { ReadOnlyMap } from '../read-only-map';
import { AudioParamRenderer } from '../renderers/audio-param';
import { AudioWorkletNodeRenderer } from '../renderers/audio-worklet-node';
import {
    TAudioParamMap,
    TChannelCountMode,
    TChannelInterpretation,
    TProcessorErrorEventHandler,
    TUnpatchedAudioContext,
    TUnpatchedOfflineAudioContext
} from '../types';
import { CHANNEL_MERGER_NODE_WRAPPER_PROVIDER } from '../wrappers/channel-merger-node';
import { CHANNEL_SPLITTER_NODE_WRAPPER_PROVIDER } from '../wrappers/channel-splitter-node';
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
        CHANNEL_MERGER_NODE_WRAPPER_PROVIDER,
        CHANNEL_SPLITTER_NODE_WRAPPER_PROVIDER,
        CONSTANT_SOURCE_NODE_FAKER_PROVIDER,
        INVALID_STATE_ERROR_FACTORY_PROVIDER,
        NATIVE_AUDIO_WORKLET_NODE_CONSTRUCTOR_PROVIDER,
        NOT_SUPPORTED_ERROR_FACTORY_PROVIDER,
        WINDOW_PROVIDER
    ]
});

const audioWorkletNodeFaker = injector.get<AudioWorkletNodeFaker>(AudioWorkletNodeFaker);
const nativeAudioWorkletNodeConstructor = injector.get(ntvDWrkltNdCnstrctr);
const notSupportedErrorFactory = injector.get(NotSupportedErrorFactory);

const createNativeAudioWorkletNode = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    name: string,
    processorDefinition: undefined | IAudioWorkletProcessorConstructor,
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
    if (processorDefinition === undefined) {
        throw notSupportedErrorFactory.create();
    }

    return audioWorkletNodeFaker.fake(nativeContext, processorDefinition, options);
};

export class AudioWorkletNode extends NoneAudioDestinationNode<INativeAudioWorkletNode> implements IAudioWorkletNode {

    private _parameters: null | TAudioParamMap;

    constructor (context: IMinimalBaseAudioContext, name: string, options: IAudioWorkletNodeOptions = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IAudioWorkletNodeOptions> { ...DEFAULT_OPTIONS, ...options };
        const nodeNameToProcessorDefinitionMap = NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS.get(nativeContext);
        const processorDefinition = (nodeNameToProcessorDefinitionMap === undefined) ?
            undefined :
            nodeNameToProcessorDefinitionMap.get(name);
        const nativeNode = createNativeAudioWorkletNode(nativeContext, name, processorDefinition, mergedOptions);

        super(context, nativeNode, mergedOptions);

        if (isOfflineAudioContext(nativeContext)) {
            const audioWorkletNodeRenderer = new AudioWorkletNodeRenderer(this, name, processorDefinition);

            AUDIO_NODE_RENDERER_STORE.set(this, audioWorkletNodeRenderer);

            const parameters: [ string, IAudioParam ][] = [ ];

            nativeNode.parameters.forEach((nativeAudioParam, nm) => {
                const audioParamRenderer = new AudioParamRenderer();
                const audioParam = new AudioParam({ audioParamRenderer, context, nativeAudioParam });

                AUDIO_PARAM_RENDERER_STORE.set(audioParam, audioParamRenderer);

                parameters.push([ nm, audioParam ]);
            });

            this._parameters = new ReadOnlyMap(parameters);
        } else {
            this._parameters = null;
        }
    }

    public get onprocessorerror () {
        return <TProcessorErrorEventHandler> (<any> this._nativeNode.onprocessorerror);
    }

    public set onprocessorerror (value) {
        this._nativeNode.onprocessorerror = <any> value;
    }

    get parameters (): TAudioParamMap {
        if (this._parameters === null) {
            return <TAudioParamMap> (<any> this._nativeNode.parameters);
        }

        return this._parameters;
    }

    get port () {
        return this._nativeNode.port;
    }

}
