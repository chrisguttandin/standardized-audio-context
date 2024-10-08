import { IAnalyserNode, IAnalyserOptions } from '../interfaces';
import { TAnalyserNodeConstructorFactory, TAudioNodeRenderer, TContext, TNativeAnalyserNode } from '../types';

const DEFAULT_OPTIONS = {
    channelCount: 2,
    channelCountMode: 'max',
    channelInterpretation: 'speakers',
    fftSize: 2048,
    maxDecibels: -30,
    minDecibels: -100,
    smoothingTimeConstant: 0.8
} as const;

export const createAnalyserNodeConstructor: TAnalyserNodeConstructorFactory = (
    audionNodeConstructor,
    createAnalyserNodeRenderer,
    createNativeAnalyserNode,
    getNativeContext,
    isNativeOfflineAudioContext
) => {
    return class AnalyserNode<T extends TContext> extends audionNodeConstructor<T> implements IAnalyserNode<T> {
        private _nativeAnalyserNode: TNativeAnalyserNode;

        constructor(context: T, options?: Partial<IAnalyserOptions>) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeAnalyserNode = createNativeAnalyserNode(nativeContext, mergedOptions);
            const analyserNodeRenderer = <TAudioNodeRenderer<T, this>>(
                (isNativeOfflineAudioContext(nativeContext) ? createAnalyserNodeRenderer() : null)
            );

            super(context, false, nativeAnalyserNode, analyserNodeRenderer);

            this._nativeAnalyserNode = nativeAnalyserNode;
        }

        get fftSize(): number {
            return this._nativeAnalyserNode.fftSize;
        }

        set fftSize(value) {
            this._nativeAnalyserNode.fftSize = value;
        }

        get frequencyBinCount(): number {
            return this._nativeAnalyserNode.frequencyBinCount;
        }

        get maxDecibels(): number {
            return this._nativeAnalyserNode.maxDecibels;
        }

        set maxDecibels(value) {
            this._nativeAnalyserNode.maxDecibels = value;
        }

        get minDecibels(): number {
            return this._nativeAnalyserNode.minDecibels;
        }

        set minDecibels(value) {
            this._nativeAnalyserNode.minDecibels = value;
        }

        get smoothingTimeConstant(): number {
            return this._nativeAnalyserNode.smoothingTimeConstant;
        }

        set smoothingTimeConstant(value) {
            this._nativeAnalyserNode.smoothingTimeConstant = value;
        }

        public getByteFrequencyData(array: Uint8Array): void {
            this._nativeAnalyserNode.getByteFrequencyData(array);
        }

        public getByteTimeDomainData(array: Uint8Array): void {
            this._nativeAnalyserNode.getByteTimeDomainData(array);
        }

        public getFloatFrequencyData(array: Float32Array): void {
            this._nativeAnalyserNode.getFloatFrequencyData(array);
        }

        public getFloatTimeDomainData(array: Float32Array): void {
            this._nativeAnalyserNode.getFloatTimeDomainData(array);
        }
    };
};
