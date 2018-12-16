import { getNativeContext } from '../helpers/get-native-context';
import { IAudioParam, IDynamicsCompressorNode, IDynamicsCompressorOptions } from '../interfaces';
import {
    TChannelCountMode,
    TContext,
    TDynamicsCompressorNodeConstructorFactory,
    TNativeAudioParam,
    TNativeDynamicsCompressorNode
} from '../types';

const DEFAULT_OPTIONS: IDynamicsCompressorOptions = {
    attack: 0.003,
    channelCount: 2,
    channelCountMode: 'clamped-max',
    channelInterpretation: 'speakers',
    knee: 30,
    ratio: 12,
    release: 0.25,
    threshold: -24
};

export const createDynamicsCompressorNodeConstructor: TDynamicsCompressorNodeConstructorFactory = (
    createAudioParam,
    createDynamicsCompressorNodeRenderer,
    createNativeDynamicsCompressorNode,
    createNotSupportedError,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class DynamicsCompressorNode extends noneAudioDestinationNodeConstructor implements IDynamicsCompressorNode {

        private _attack: IAudioParam;

        private _knee: IAudioParam;

        private _nativeDynamicsCompressorNode: TNativeDynamicsCompressorNode;

        private _ratio: IAudioParam;

        private _release: IAudioParam;

        private _threshold: IAudioParam;

        constructor (context: TContext, options: Partial<IDynamicsCompressorOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeDynamicsCompressorNode = createNativeDynamicsCompressorNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const dynamicsCompressorNodeRenderer = (isOffline) ? createDynamicsCompressorNodeRenderer() : null;

            super(context, nativeDynamicsCompressorNode, dynamicsCompressorNodeRenderer);

            // Bug #110: Edge does not export the correct values for maxValue and minValue.
            this._attack = createAudioParam(context, isOffline, nativeDynamicsCompressorNode.attack, 1, 0);
            this._knee = createAudioParam(context, isOffline, nativeDynamicsCompressorNode.knee, 40, 0);
            this._nativeDynamicsCompressorNode = nativeDynamicsCompressorNode;
            this._ratio = createAudioParam(context, isOffline, nativeDynamicsCompressorNode.ratio, 20, 1);
            this._release = createAudioParam(context, isOffline, nativeDynamicsCompressorNode.release, 1, 0);
            this._threshold = createAudioParam(context, isOffline, nativeDynamicsCompressorNode.threshold, 0, -100);
        }

        public get attack (): IAudioParam {
            return this._attack;
        }

        /*
         * Bug #108: Only Chrome and Opera disallow a channelCount of three and above yet which is why the getter and setter needs to be
         * overwritten here.
         */
        public get channelCount (): number {
            return this._nativeDynamicsCompressorNode.channelCount;
        }

        public set channelCount (value) {
            const previousChannelCount = this._nativeDynamicsCompressorNode.channelCount;

            this._nativeDynamicsCompressorNode.channelCount = value;

            if (value > 2) {
                this._nativeDynamicsCompressorNode.channelCount = previousChannelCount;

                throw createNotSupportedError();
            }
        }

        /*
         * Bug #109: Only Chrome and Opera disallow a channelCountMode of 'max' yet which is why the getter and setter needs to be
         * overwritten here.
         */
        public get channelCountMode (): TChannelCountMode {
            return this._nativeDynamicsCompressorNode.channelCountMode;
        }

        public set channelCountMode (value) {
            const previousChannelCount = this._nativeDynamicsCompressorNode.channelCountMode;

            this._nativeDynamicsCompressorNode.channelCountMode = value;

            if (value === 'max') {
                this._nativeDynamicsCompressorNode.channelCountMode = previousChannelCount;

                throw createNotSupportedError();
            }
        }

        public get knee (): IAudioParam {
            return this._knee;
        }

        public get ratio (): IAudioParam {
            return this._ratio;
        }

        public get reduction (): number {
            // Bug #111: Safari returns an AudioParam instead of a number.
            if (typeof (<TNativeAudioParam> (<any> this._nativeDynamicsCompressorNode.reduction)).value === 'number') {
                return (<TNativeAudioParam> (<any> this._nativeDynamicsCompressorNode.reduction)).value;
            }

            return this._nativeDynamicsCompressorNode.reduction;
        }

        public get release (): IAudioParam {
            return this._release;
        }

        public get threshold (): IAudioParam {
            return this._threshold;
        }

    };

};
