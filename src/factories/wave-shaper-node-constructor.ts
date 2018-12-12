import { getNativeContext } from '../helpers/get-native-context';
import { IWaveShaperNode, IWaveShaperOptions } from '../interfaces';
import { TContext, TNativeWaveShaperNode, TOverSampleType, TWaveShaperNodeConstructorFactory } from '../types';

const DEFAULT_OPTIONS: IWaveShaperOptions = {
    channelCount: 2,
    channelCountMode: 'max',
    channelInterpretation: 'speakers',
    curve: null,
    oversample: 'none'
};

export const createWaveShaperNodeConstructor: TWaveShaperNodeConstructorFactory = (
    createInvalidStateError,
    createNativeWaveShaperNode,
    createWaveShaperNodeRenderer,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class WaveShaperNode extends noneAudioDestinationNodeConstructor implements IWaveShaperNode {

        private _isCurveNullified: boolean;

        private _nativeWaveShaperNode: TNativeWaveShaperNode;

        constructor (context: TContext, options: Partial<IWaveShaperOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeWaveShaperNode = createNativeWaveShaperNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const waveShaperNodeRenderer = (isOffline) ? createWaveShaperNodeRenderer() : null;

            super(context, nativeWaveShaperNode, waveShaperNodeRenderer);

            this._isCurveNullified = false;
            this._nativeWaveShaperNode = nativeWaveShaperNode;
        }

        public get curve (): null | Float32Array {
            if (this._isCurveNullified) {
                return null;
            }

            return this._nativeWaveShaperNode.curve;
        }

        public set curve (value) {
            // Bug #103: Safari does not allow to set the curve to null.
            if (value === null) {
                this._isCurveNullified = true;
                this._nativeWaveShaperNode.curve = new Float32Array([ 0, 0 ]);

            // Bug #102: Safari does not throw an InvalidStateError when the curve has less than two samples.
            // Bug #104: Chrome will throw an InvalidAccessError when the curve has less than two samples.
            } else if (value.length < 2) {
                throw createInvalidStateError();
            } else {
                this._isCurveNullified = false;
                this._nativeWaveShaperNode.curve = value;
            }
        }

        public get oversample (): TOverSampleType {
            return this._nativeWaveShaperNode.oversample;
        }

        public set oversample (value) {
            this._nativeWaveShaperNode.oversample = value;
        }

    };

};
