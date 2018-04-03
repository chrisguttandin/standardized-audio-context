import { AUDIO_NODE_RENDERER_STORE } from '../globals';
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
    createAudioParam,
    createNativeGainNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class GainNode extends noneAudioDestinationNodeConstructor implements IGainNode {

        private _gain: IAudioParam;

        constructor (context: IMinimalBaseAudioContext, options: Partial<IGainOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IGainOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeNode = createNativeGainNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);

            super(context, nativeNode);

            // Bug #74: Edge, Firefox & Safari do not export the correct values for maxValue and minValue.
            this._gain = createAudioParam(context, isOffline, nativeNode.gain, 3.4028234663852886e38, -3.4028234663852886e38);

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
