import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { createNativeAnalyserNode } from '../helpers/create-native-analyser-node';
import { getNativeContext } from '../helpers/get-native-context';
import { IAnalyserNode, IAnalyserOptions, IMinimalBaseAudioContext } from '../interfaces';
import { AnalyserNodeRenderer } from '../renderers/analyser-node';
import { TAnalyserNodeConstructorFactory, TChannelCountMode, TChannelInterpretation, TNativeAnalyserNode } from '../types';

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
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class AnalyserNode extends noneAudioDestinationNodeConstructor implements IAnalyserNode {

        private _nativeNode: TNativeAnalyserNode;

        constructor (context: IMinimalBaseAudioContext, options: Partial<IAnalyserOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IAnalyserOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeNode = createNativeAnalyserNode(nativeContext, mergedOptions);

            super(context, nativeNode);

            if (isNativeOfflineAudioContext(nativeContext)) {
                const analyserNodeRenderer = new AnalyserNodeRenderer(this);

                AUDIO_NODE_RENDERER_STORE.set(this, analyserNodeRenderer);
            }

            this._nativeNode = nativeNode;
        }

        public get fftSize () {
            return this._nativeNode.fftSize;
        }

        public set fftSize (value) {
            this._nativeNode.fftSize = value;
        }

        public get frequencyBinCount () {
            return this._nativeNode.frequencyBinCount;
        }

        public get maxDecibels () {
            return this._nativeNode.maxDecibels;
        }

        public set maxDecibels (value) {
            this._nativeNode.maxDecibels = value;
        }

        public get minDecibels () {
            return this._nativeNode.minDecibels;
        }

        public set minDecibels (value) {
            this._nativeNode.minDecibels = value;
        }

        public get smoothingTimeConstant () {
            return this._nativeNode.smoothingTimeConstant;
        }

        public set smoothingTimeConstant (value) {
            this._nativeNode.smoothingTimeConstant = value;
        }

        public getByteFrequencyData (array: Uint8Array) {
            this._nativeNode.getByteFrequencyData(array);
        }

        public getByteTimeDomainData (array: Uint8Array) {
            this._nativeNode.getByteTimeDomainData(array);
        }

        public getFloatFrequencyData (array: Float32Array) {
            this._nativeNode.getFloatFrequencyData(array);
        }

        public getFloatTimeDomainData (array: Float32Array) {
            this._nativeNode.getFloatTimeDomainData(array);
        }

    };

};
