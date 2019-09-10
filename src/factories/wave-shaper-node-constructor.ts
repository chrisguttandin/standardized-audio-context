import { getNativeContext } from '../helpers/get-native-context';
import { IMinimalBaseAudioContext, IWaveShaperNode, IWaveShaperOptions } from '../interfaces';
import { TAudioNodeRenderer, TNativeWaveShaperNode, TOverSampleType, TWaveShaperNodeConstructorFactory } from '../types';

const DEFAULT_OPTIONS = {
    channelCount: 2,
    channelCountMode: 'max',
    channelInterpretation: 'speakers',
    curve: null,
    oversample: 'none'
} as const;

export const createWaveShaperNodeConstructor: TWaveShaperNodeConstructorFactory = (
    createInvalidStateError,
    createNativeWaveShaperNode,
    createWaveShaperNodeRenderer,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class WaveShaperNode<T extends IMinimalBaseAudioContext>
            extends noneAudioDestinationNodeConstructor<T>
            implements IWaveShaperNode<T> {

        private _isCurveNullified: boolean;

        private _nativeWaveShaperNode: TNativeWaveShaperNode;

        constructor (context: T, options: Partial<IWaveShaperOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeWaveShaperNode = createNativeWaveShaperNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const waveShaperNodeRenderer = <TAudioNodeRenderer<T, this>> ((isOffline) ? createWaveShaperNodeRenderer() : null);

            super(context, false, nativeWaveShaperNode, waveShaperNodeRenderer);

            this._isCurveNullified = false;
            this._nativeWaveShaperNode = nativeWaveShaperNode;
        }

        get curve (): null | Float32Array {
            if (this._isCurveNullified) {
                return null;
            }

            return this._nativeWaveShaperNode.curve;
        }

        set curve (value) {
            // Bug #103: Safari does not allow to set the curve to null.
            if (value === null) {
                this._isCurveNullified = true;
                this._nativeWaveShaperNode.curve = new Float32Array([ 0, 0 ]);
            } else {
                // Bug #102: Safari does not throw an InvalidStateError when the curve has less than two samples.
                // Bug #104: Chrome will throw an InvalidAccessError when the curve has less than two samples.
                if (value.length < 2) {
                    throw createInvalidStateError();
                }

                this._isCurveNullified = false;
                this._nativeWaveShaperNode.curve = value;
            }
        }

        get oversample (): TOverSampleType {
            return this._nativeWaveShaperNode.oversample;
        }

        set oversample (value) {
            this._nativeWaveShaperNode.oversample = value;
        }

    };

};
