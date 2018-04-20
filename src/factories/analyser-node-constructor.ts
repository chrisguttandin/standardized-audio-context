import { getNativeContext } from '../helpers/get-native-context';
import { IAnalyserNode, IAnalyserOptions } from '../interfaces';
import { TAnalyserNodeConstructorFactory, TChannelCountMode, TChannelInterpretation, TContext, TNativeAnalyserNode } from '../types';

const DEFAULT_OPTIONS: IAnalyserOptions = {
    channelCount: 2,
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    fftSize: 2048,
    maxDecibels: -30,
    minDecibels: -100,
    smoothingTimeConstant: 0.8
};

export const createAnalyserNodeConstructor: TAnalyserNodeConstructorFactory = (
    createAnalyserNodeRenderer,
    createNativeAnalyserNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class AnalyserNode extends noneAudioDestinationNodeConstructor implements IAnalyserNode {

        private _nativeAnalyserNode: TNativeAnalyserNode;

        constructor (context: TContext, options: Partial<IAnalyserOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IAnalyserOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeAnalyserNode = createNativeAnalyserNode(nativeContext, mergedOptions);
            const analyserNodeRenderer = (isNativeOfflineAudioContext(nativeContext)) ? createAnalyserNodeRenderer() : null;

            super(context, nativeAnalyserNode, analyserNodeRenderer);

            this._nativeAnalyserNode = nativeAnalyserNode;
        }

        public get fftSize () {
            return this._nativeAnalyserNode.fftSize;
        }

        public set fftSize (value) {
            this._nativeAnalyserNode.fftSize = value;
        }

        public get frequencyBinCount () {
            return this._nativeAnalyserNode.frequencyBinCount;
        }

        public get maxDecibels () {
            return this._nativeAnalyserNode.maxDecibels;
        }

        public set maxDecibels (value) {
            this._nativeAnalyserNode.maxDecibels = value;
        }

        public get minDecibels () {
            return this._nativeAnalyserNode.minDecibels;
        }

        public set minDecibels (value) {
            this._nativeAnalyserNode.minDecibels = value;
        }

        public get smoothingTimeConstant () {
            return this._nativeAnalyserNode.smoothingTimeConstant;
        }

        public set smoothingTimeConstant (value) {
            this._nativeAnalyserNode.smoothingTimeConstant = value;
        }

        public getByteFrequencyData (array: Uint8Array) {
            this._nativeAnalyserNode.getByteFrequencyData(array);
        }

        public getByteTimeDomainData (array: Uint8Array) {
            this._nativeAnalyserNode.getByteTimeDomainData(array);
        }

        public getFloatFrequencyData (array: Float32Array) {
            this._nativeAnalyserNode.getFloatFrequencyData(array);
        }

        public getFloatTimeDomainData (array: Float32Array) {
            this._nativeAnalyserNode.getFloatTimeDomainData(array);
        }

    };

};
