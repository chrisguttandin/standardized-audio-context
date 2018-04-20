import { getNativeContext } from '../helpers/get-native-context';
import { IAudioParam, IOscillatorNode, IOscillatorNodeRenderer, IOscillatorOptions } from '../interfaces';
import {
    TChannelCountMode,
    TChannelInterpretation,
    TEndedEventHandler,
    TNativeOscillatorNode,
    TOscillatorNodeConstructorFactory,
    TOscillatorType,
    TStandardizedContext
} from '../types';

// The DEFAULT_OPTIONS are only of type Partial<IOscillatorOptions> because there is no default value for periodicWave.
const DEFAULT_OPTIONS: Partial<IOscillatorOptions> = {
    channelCount: 2,
    channelCountMode: <TChannelCountMode> 'max', // This attribute has no effect for nodes with no inputs.
    channelInterpretation: <TChannelInterpretation> 'speakers', // This attribute has no effect for nodes with no inputs.
    detune: 0,
    frequency: 440,
    type: <TOscillatorType> 'sine'
};

export const createOscillatorNodeConstructor: TOscillatorNodeConstructorFactory = (
    createAudioParam,
    createInvalidStateError,
    createNativeOscillatorNode,
    createOscillatorNodeRenderer,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return  class OscillatorNode extends noneAudioDestinationNodeConstructor implements IOscillatorNode {

        private _detune: IAudioParam;

        private _frequency: IAudioParam;

        private _nativeNode: TNativeOscillatorNode;

        private _oscillatorNodeRenderer: null | IOscillatorNodeRenderer;

        constructor (context: TStandardizedContext, options: Partial<IOscillatorOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IOscillatorOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeNode = createNativeOscillatorNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const oscillatorNodeRenderer = (isOffline) ? createOscillatorNodeRenderer() : null;

            super(context, nativeNode, oscillatorNodeRenderer);

            // Bug #81: Edge, Firefox & Safari do not export the correct values for maxValue and minValue.
            this._detune = createAudioParam(context, isOffline, nativeNode.detune, 3.4028234663852886e38, -3.4028234663852886e38);
            // Bug #76: Edge & Safari do not export the correct values for maxValue and minValue.
            this._frequency = createAudioParam(context, isOffline, nativeNode.frequency, context.sampleRate / 2, -(context.sampleRate / 2));
            this._nativeNode = nativeNode;
            this._oscillatorNodeRenderer = oscillatorNodeRenderer;
        }

        public get detune () {
            return this._detune;
        }

        public get frequency () {
            return this._frequency;
        }

        public get onended () {
            return <TEndedEventHandler> (<any> this._nativeNode.onended);
        }

        public set onended (value) {
            this._nativeNode.onended = <any> value;
        }

        public get type () {
            return this._nativeNode.type;
        }

        public set type (value) {
            this._nativeNode.type = value;

            // Bug #57: Edge will not throw an error when assigning the type to 'custom'. But it still will change the value.
            if (value === 'custom') {
                throw createInvalidStateError();
            }
        }

        public setPeriodicWave (periodicWave: PeriodicWave) {
            this._nativeNode.setPeriodicWave(periodicWave);
        }

        public start (when = 0) {
            this._nativeNode.start(when);

            if (this._oscillatorNodeRenderer !== null) {
                this._oscillatorNodeRenderer.start = when;
            }
        }

        public stop (when = 0) {
            this._nativeNode.stop(when);

            if (this._oscillatorNodeRenderer !== null) {
                this._oscillatorNodeRenderer.stop = when;
            }
        }

    };

};
