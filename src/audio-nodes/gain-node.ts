import { Injector } from '@angular/core';
import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IAudioParam, IGainNode, IGainOptions, IMinimalBaseAudioContext } from '../interfaces';
import { GainNodeRenderer } from '../renderers/gain-node';
import {
    TChannelCountMode,
    TChannelInterpretation,
    TNativeGainNode,
    TUnpatchedAudioContext,
    TUnpatchedOfflineAudioContext
} from '../types';
import { AUDIO_PARAM_WRAPPER_PROVIDER, AudioParamWrapper } from '../wrappers/audio-param';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const injector = Injector.create({
    providers: [
        AUDIO_PARAM_WRAPPER_PROVIDER
    ]
});

const audioParamWrapper = injector.get(AudioParamWrapper);

const DEFAULT_OPTIONS: IGainOptions = {
    channelCount: 2,
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    gain: 1
};

const createNativeGainNode = (nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext, options: IGainOptions) => {
    const nativeNode = nativeContext.createGain();

    if (options.channelCount !== undefined) {
        nativeNode.channelCount = options.channelCount;
    }

    if (options.channelCountMode !== undefined) {
        nativeNode.channelCountMode = options.channelCountMode;
    }

    if (options.channelInterpretation !== undefined) {
        nativeNode.channelInterpretation = options.channelInterpretation;
    }

    if (options.gain !== undefined) {
        nativeNode.gain.value = options.gain;
    }

    return nativeNode;
};

export class GainNode extends NoneAudioDestinationNode<TNativeGainNode> implements IGainNode {

    constructor (context: IMinimalBaseAudioContext, options: Partial<IGainOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IGainOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = createNativeGainNode(nativeContext, mergedOptions);

        super(context, nativeNode, mergedOptions.channelCount);

        if (isOfflineAudioContext(nativeContext)) {
            const gainNodeRenderer = new GainNodeRenderer(this);

            AUDIO_NODE_RENDERER_STORE.set(this, gainNodeRenderer);

            audioParamWrapper.wrap(nativeNode, context, 'gain');
        }
    }

    public get gain () {
        return <IAudioParam> (<any> this._nativeNode.gain);
    }

}
