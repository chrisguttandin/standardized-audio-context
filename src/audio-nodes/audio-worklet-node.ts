import { Injector } from '@angular/core';
import { NOT_SUPPORTED_ERROR_FACTORY_PROVIDER, NotSupportedErrorFactory } from '../factories/not-supported-error';
import { NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS } from '../globals';
import { getNativeContext } from '../helpers/get-native-context';
import { IAudioWorkletNode, IAudioWorkletNodeOptions, IMinimalBaseAudioContext, INativeAudioWorkletNode } from '../interfaces';
import {
    NATIVE_AUDIO_WORKLET_NODE_CONSTRUCTOR_PROVIDER,
    nativeAudioWorkletNodeConstructor as ntvDWrkltNdCnstrctr
} from '../providers/native-audio-worklet-node-constructor';
import { WINDOW_PROVIDER } from '../providers/window';
import {
    TChannelCountMode,
    TChannelInterpretation,
    TNativeAudioWorkletNodeOptions,
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
        NATIVE_AUDIO_WORKLET_NODE_CONSTRUCTOR_PROVIDER,
        NOT_SUPPORTED_ERROR_FACTORY_PROVIDER,
        WINDOW_PROVIDER
    ]
});

const nativeAudioWorkletNodeConstructor = injector.get(ntvDWrkltNdCnstrctr);
const notSupportedErrorFactory = injector.get(NotSupportedErrorFactory);

const createNativeAudioWorkletNode = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    name: string,
    options: TNativeAudioWorkletNodeOptions
) => {
    if (nativeAudioWorkletNodeConstructor !== null) {
        try {
            return new nativeAudioWorkletNodeConstructor(nativeContext, name, options);
        } catch (err) {
            // Bug #60: Chrome Canary throws an InvalidStateError instead of a NotSupportedError.
            if (err.code === 11) {
                throw notSupportedErrorFactory.create();
            }

            throw err;
        }
    }

    return null;
};

export class AudioWorkletNode extends NoneAudioDestinationNode<INativeAudioWorkletNode> implements IAudioWorkletNode {

    private _port: null | MessagePort;

    constructor (context: IMinimalBaseAudioContext, name: string, options: IAudioWorkletNodeOptions = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IAudioWorkletNodeOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = createNativeAudioWorkletNode(nativeContext, name, mergedOptions);

        if (nativeNode === null) {
            const nodeNameToProcessorDefinitionMap = NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS.get(nativeContext);

            if (nodeNameToProcessorDefinitionMap === undefined || !nodeNameToProcessorDefinitionMap.has(name)) {
                throw notSupportedErrorFactory.create();
            }
        }

        super(context, nativeNode, mergedOptions);

        this._port = (nativeNode === null) ? null : (new MessageChannel()).port1;
    }

    get port () {
        if (this._nativeNode === null) {
            if (this._port === null) {
                throw new Error('Missing the port.');
            }

            return this._port;
        }

        return this._nativeNode.port;
    }

}
