import { getNativeContext } from '../helpers/get-native-context';
import { IAnalyserNode, IAnalyserOptions } from '../interfaces';
import { TAnalyserNodeConstructorFactory, TContext, TNativeAnalyserNode } from '../types';

const DEFAULT_OPTIONS: IAnalyserOptions = {
    channelCount: 2,
    channelCountMode: 'max',
    channelInterpretation: 'speakers',
    fftSize: 2048,
    maxDecibels: -30,
    minDecibels: -100,
    smoothingTimeConstant: 0.8
};

export const createAnalyserNodeConstructor: TAnalyserNodeConstructorFactory = (
    createAnalyserNodeRenderer,
    createIndexSizeError,
    createNativeAnalyserNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class AnalyserNode extends noneAudioDestinationNodeConstructor implements IAnalyserNode {

        private _nativeAnalyserNode: TNativeAnalyserNode;

        constructor (context: TContext, options: Partial<IAnalyserOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeAnalyserNode = createNativeAnalyserNode(nativeContext, mergedOptions);
            const analyserNodeRenderer = (isNativeOfflineAudioContext(nativeContext)) ? createAnalyserNodeRenderer() : null;

            super(context, nativeAnalyserNode, analyserNodeRenderer);

            this._nativeAnalyserNode = nativeAnalyserNode;
        }

        public get fftSize (): number {
            return this._nativeAnalyserNode.fftSize;
        }

        public set fftSize (value) {
            this._nativeAnalyserNode.fftSize = value;
        }

        public get frequencyBinCount (): number {
            return this._nativeAnalyserNode.frequencyBinCount;
        }

        public get maxDecibels (): number {
            return this._nativeAnalyserNode.maxDecibels;
        }

        public set maxDecibels (value) {
            // Bug #118: Safari does not throw an error if maxDecibels is not more than minDecibels.
            const maxDecibels = this._nativeAnalyserNode.maxDecibels;

            this._nativeAnalyserNode.maxDecibels = value;

            if (!(value > this._nativeAnalyserNode.minDecibels)) {
                this._nativeAnalyserNode.maxDecibels = maxDecibels;

                throw createIndexSizeError();
            }
        }

        public get minDecibels (): number {
            return this._nativeAnalyserNode.minDecibels;
        }

        public set minDecibels (value) {
            // Bug #118: Safari does not throw an error if maxDecibels is not more than minDecibels.
            const minDecibels = this._nativeAnalyserNode.minDecibels;

            this._nativeAnalyserNode.minDecibels = value;

            if (!(this._nativeAnalyserNode.maxDecibels > value)) {
                this._nativeAnalyserNode.minDecibels = minDecibels;

                throw createIndexSizeError();
            }
        }

        public get smoothingTimeConstant (): number {
            return this._nativeAnalyserNode.smoothingTimeConstant;
        }

        public set smoothingTimeConstant (value) {
            this._nativeAnalyserNode.smoothingTimeConstant = value;
        }

        public getByteFrequencyData (array: Uint8Array): void {
            this._nativeAnalyserNode.getByteFrequencyData(array);
        }

        public getByteTimeDomainData (array: Uint8Array): void {
            this._nativeAnalyserNode.getByteTimeDomainData(array);
        }

        public getFloatFrequencyData (array: Float32Array): void {
            this._nativeAnalyserNode.getFloatFrequencyData(array);
        }

        public getFloatTimeDomainData (array: Float32Array): void {
            this._nativeAnalyserNode.getFloatTimeDomainData(array);
        }

    };

};
