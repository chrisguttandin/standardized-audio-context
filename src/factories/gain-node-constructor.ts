import { AudioParam } from '../audio-param';
import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { createNativeGainNode } from '../helpers/create-native-gain-node';
import { getNativeContext } from '../helpers/get-native-context';
import { IAudioParam, IGainNode, IGainOptions, IMinimalBaseAudioContext } from '../interfaces';
import { GainNodeRenderer } from '../renderers/gain-node';
import { TChannelCountMode, TChannelInterpretation, TGainNodeConstructorFactory } from '../types';

const DEFAULT_OPTIONS: IGainOptions = {
    channelCount: 2,
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    gain: 1
};

export const createGainNodeConstructor: TGainNodeConstructorFactory = (
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class GainNode extends noneAudioDestinationNodeConstructor implements IGainNode {

        private _gain: IAudioParam;

        constructor (context: IMinimalBaseAudioContext, options: Partial<IGainOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IGainOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeNode = createNativeGainNode(nativeContext, mergedOptions);

            super(context, nativeNode);

            // Bug #74: Edge, Firefox & Safari do not export the correct values for maxValue and minValue.
            this._gain = new AudioParam({
                context,
                isAudioParamOfOfflineAudioContext: isNativeOfflineAudioContext(nativeContext),
                maxValue: 3.4028234663852886e38,
                minValue: -3.4028234663852886e38,
                nativeAudioParam: nativeNode.gain
            });

            if (isNativeOfflineAudioContext(nativeContext)) {
                const gainNodeRenderer = new GainNodeRenderer(this);

                AUDIO_NODE_RENDERER_STORE.set(this, gainNodeRenderer);
            }
        }

        public get gain () {
            return this._gain;
        }

    };

};
