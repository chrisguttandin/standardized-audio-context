import { Injector } from '@angular/core';
import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { createNativeGainNode } from '../helpers/create-native-gain-node';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IAudioParam, IGainNode, IGainOptions, IMinimalBaseAudioContext } from '../interfaces';
import { GainNodeRenderer } from '../renderers/gain-node';
import { TChannelCountMode, TChannelInterpretation, TNativeGainNode } from '../types';
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

export class GainNode extends NoneAudioDestinationNode<TNativeGainNode> implements IGainNode {

    constructor (context: IMinimalBaseAudioContext, options: Partial<IGainOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IGainOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = createNativeGainNode(nativeContext, mergedOptions);

        super(context, nativeNode, mergedOptions.channelCount);

        // Bug #74: Edge, Firefox & Safari do not export the correct values for maxValue and minValue.
        audioParamWrapper.wrap(nativeNode, context, nativeNode.gain, 'gain', 3.4028234663852886e38, -3.4028234663852886e38);

        if (isOfflineAudioContext(nativeContext)) {
            const gainNodeRenderer = new GainNodeRenderer(this);

            AUDIO_NODE_RENDERER_STORE.set(this, gainNodeRenderer);
        }
    }

    public get gain () {
        return <IAudioParam> (<any> this._nativeNode.gain);
    }

}
