import { IAudioParam, IDynamicsCompressorNode, IDynamicsCompressorOptions } from '../interfaces';
import {
    TAudioNodeRenderer,
    TChannelCountMode,
    TContext,
    TDynamicsCompressorNodeConstructorFactory,
    TNativeAudioParam,
    TNativeDynamicsCompressorNode
} from '../types';

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
    createNotSupportedError,
    getNativeContext,
    isNativeOfflineAudioContext
) => {
    return class DynamicsCompressorNode<T extends TContext> extends audioNodeConstructor<T> implements IDynamicsCompressorNode<T> {
        private _attack: IAudioParam;

        private _knee: IAudioParam;

        private _nativeDynamicsCompressorNode: TNativeDynamicsCompressorNode;

        private _ratio: IAudioParam;

        private _release: IAudioParam;

        private _threshold: IAudioParam;

        constructor(context: T, options: Partial<IDynamicsCompressorOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeDynamicsCompressorNode = createNativeDynamicsCompressorNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const dynamicsCompressorNodeRenderer = <TAudioNodeRenderer<T, this>>(isOffline ? createDynamicsCompressorNodeRenderer() : null);

            super(context, false, nativeDynamicsCompressorNode, dynamicsCompressorNodeRenderer);

            // Bug #110: Edge does not export the correct values for maxValue and minValue.
            this._attack = createAudioParam(this, isOffline, nativeDynamicsCompressorNode.attack, 1, 0);
            this._knee = createAudioParam(this, isOffline, nativeDynamicsCompressorNode.knee, 40, 0);
            this._nativeDynamicsCompressorNode = nativeDynamicsCompressorNode;
            this._ratio = createAudioParam(this, isOffline, nativeDynamicsCompressorNode.ratio, 20, 1);
            this._release = createAudioParam(this, isOffline, nativeDynamicsCompressorNode.release, 1, 0);
            this._threshold = createAudioParam(this, isOffline, nativeDynamicsCompressorNode.threshold, 0, -100);
        }

        get attack(): IAudioParam {
            return this._attack;
        }

        /*
         * Bug #108: Only Chrome, Firefox and Opera disallow a channelCount of three and above yet which is why the getter and setter needs
         * to be overwritten here.
         */
        get channelCount(): number {
            return this._nativeDynamicsCompressorNode.channelCount;
        }

        set channelCount(value) {
            const previousChannelCount = this._nativeDynamicsCompressorNode.channelCount;

            this._nativeDynamicsCompressorNode.channelCount = value;

            if (value > 2) {
                this._nativeDynamicsCompressorNode.channelCount = previousChannelCount;

                throw createNotSupportedError();
            }
        }

        /*
         * Bug #109: Only Chrome, Firefox and Opera disallow a channelCountMode of 'max' yet which is why the getter and setter needs to be
         * overwritten here.
         */
        get channelCountMode(): TChannelCountMode {
            return this._nativeDynamicsCompressorNode.channelCountMode;
        }

        set channelCountMode(value) {
            const previousChannelCount = this._nativeDynamicsCompressorNode.channelCountMode;

            this._nativeDynamicsCompressorNode.channelCountMode = value;

            if (value === 'max') {
                this._nativeDynamicsCompressorNode.channelCountMode = previousChannelCount;

                throw createNotSupportedError();
            }
        }

        get knee(): IAudioParam {
            return this._knee;
        }

        get ratio(): IAudioParam {
            return this._ratio;
        }

        get reduction(): number {
            // Bug #111: Safari returns an AudioParam instead of a number.
            if (typeof (<TNativeAudioParam>(<any>this._nativeDynamicsCompressorNode.reduction)).value === 'number') {
                return (<TNativeAudioParam>(<any>this._nativeDynamicsCompressorNode.reduction)).value;
            }

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
