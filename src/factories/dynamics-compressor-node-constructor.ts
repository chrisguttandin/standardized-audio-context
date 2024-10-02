import { IAudioParam, IDynamicsCompressorNode, IDynamicsCompressorOptions } from '../interfaces';
import { TAudioNodeRenderer, TContext, TDynamicsCompressorNodeConstructorFactory, TNativeDynamicsCompressorNode } from '../types';

const DEFAULT_OPTIONS = {
    attack: 0.003,
    channelCount: 2,
    channelCountMode: 'clamped-max',
    channelInterpretation: 'speakers',
    knee: 30,
    ratio: 12,
    release: 0.25,
    threshold: -24
} as const;

export const createDynamicsCompressorNodeConstructor: TDynamicsCompressorNodeConstructorFactory = (
    audioNodeConstructor,
    createAudioParam,
    createDynamicsCompressorNodeRenderer,
    createNativeDynamicsCompressorNode,
    getNativeContext,
    isNativeOfflineAudioContext,
    setAudioNodeTailTime
) => {
    return class DynamicsCompressorNode<T extends TContext> extends audioNodeConstructor<T> implements IDynamicsCompressorNode<T> {
        private _attack: IAudioParam;

        private _knee: IAudioParam;

        private _nativeDynamicsCompressorNode: TNativeDynamicsCompressorNode;

        private _ratio: IAudioParam;

        private _release: IAudioParam;

        private _threshold: IAudioParam;

        constructor(context: T, options?: Partial<IDynamicsCompressorOptions>) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeDynamicsCompressorNode = createNativeDynamicsCompressorNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const dynamicsCompressorNodeRenderer = <TAudioNodeRenderer<T, this>>(isOffline ? createDynamicsCompressorNodeRenderer() : null);

            super(context, false, nativeDynamicsCompressorNode, dynamicsCompressorNodeRenderer);

            this._attack = createAudioParam(this, isOffline, nativeDynamicsCompressorNode.attack);
            this._knee = createAudioParam(this, isOffline, nativeDynamicsCompressorNode.knee);
            this._nativeDynamicsCompressorNode = nativeDynamicsCompressorNode;
            this._ratio = createAudioParam(this, isOffline, nativeDynamicsCompressorNode.ratio);
            this._release = createAudioParam(this, isOffline, nativeDynamicsCompressorNode.release);
            this._threshold = createAudioParam(this, isOffline, nativeDynamicsCompressorNode.threshold);

            setAudioNodeTailTime(this, 0.006);
        }

        get attack(): IAudioParam {
            return this._attack;
        }

        get knee(): IAudioParam {
            return this._knee;
        }

        get ratio(): IAudioParam {
            return this._ratio;
        }

        get reduction(): number {
            return this._nativeDynamicsCompressorNode.reduction;
        }

        get release(): IAudioParam {
            return this._release;
        }

        get threshold(): IAudioParam {
            return this._threshold;
        }
    };
};
