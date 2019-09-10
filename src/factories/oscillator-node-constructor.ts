import { getNativeContext } from '../helpers/get-native-context';
import { setInternalState } from '../helpers/set-internal-state';
import { wrapEventListener } from '../helpers/wrap-event-listener';
import {
    IAudioParam,
    IEndedEventHandler,
    IMinimalBaseAudioContext,
    IMinimalOfflineAudioContext,
    IOscillatorNode,
    IOscillatorNodeRenderer,
    IOscillatorOptions
} from '../interfaces';
import { TNativeOscillatorNode, TOscillatorNodeConstructorFactory, TOscillatorNodeRenderer, TOscillatorType } from '../types';

const DEFAULT_OPTIONS = {
    channelCount: 2,
    channelCountMode: 'max', // This attribute has no effect for nodes with no inputs.
    channelInterpretation: 'speakers', // This attribute has no effect for nodes with no inputs.
    detune: 0,
    frequency: 440,
    type: 'sine'
} as const;

export const createOscillatorNodeConstructor: TOscillatorNodeConstructorFactory = (
    createAudioParam,
    createInvalidStateError,
    createNativeOscillatorNode,
    createOscillatorNodeRenderer,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class OscillatorNode<T extends IMinimalBaseAudioContext>
            extends noneAudioDestinationNodeConstructor<T>
            implements IOscillatorNode<T> {

        private _detune: IAudioParam;

        private _frequency: IAudioParam;

        private _nativeOscillatorNode: TNativeOscillatorNode;

        private _onended: null | IEndedEventHandler<T, this>;

        private _oscillatorNodeRenderer: null | IOscillatorNodeRenderer<IMinimalOfflineAudioContext>;

        constructor (context: T, options: Partial<IOscillatorOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeOscillatorNode = createNativeOscillatorNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const oscillatorNodeRenderer = <TOscillatorNodeRenderer<T>> ((isOffline) ? createOscillatorNodeRenderer() : null);
            const nyquist = context.sampleRate / 2;

            super(context, 'passive', nativeOscillatorNode, oscillatorNodeRenderer);

            // Bug #81: Edge, Firefox & Safari do not export the correct values for maxValue and minValue.
            this._detune = createAudioParam(this, isOffline, nativeOscillatorNode.detune, 153600, -153600);
            // Bug #76: Edge & Safari do not export the correct values for maxValue and minValue.
            this._frequency = createAudioParam(this, isOffline, nativeOscillatorNode.frequency, nyquist, -nyquist);
            this._nativeOscillatorNode = nativeOscillatorNode;
            this._onended = null;
            this._oscillatorNodeRenderer = oscillatorNodeRenderer;

            if (this._oscillatorNodeRenderer !== null && mergedOptions.periodicWave !== undefined) {
                (<IOscillatorNodeRenderer<IMinimalOfflineAudioContext>> this._oscillatorNodeRenderer).periodicWave =
                    mergedOptions.periodicWave;
            }
        }

        get detune (): IAudioParam {
            return this._detune;
        }

        get frequency (): IAudioParam {
            return this._frequency;
        }

        get onended (): null | IEndedEventHandler<T, this> {
            return this._onended;
        }

        set onended (value) {
            const wrappedListener = <TNativeOscillatorNode['onended']> wrapEventListener(this, value);

            this._nativeOscillatorNode.onended = wrappedListener;

            const nativeOnEnded = <null | IEndedEventHandler<T, this>> this._nativeOscillatorNode.onended;

            this._onended = (nativeOnEnded === wrappedListener) ? value : nativeOnEnded;
        }

        get type (): TOscillatorType {
            return this._nativeOscillatorNode.type;
        }

        set type (value) {
            this._nativeOscillatorNode.type = value;

            // Bug #57: Edge will not throw an error when assigning the type to 'custom'. But it still will change the value.
            if (value === 'custom') {
                throw createInvalidStateError();
            }

            if (this._oscillatorNodeRenderer !== null) {
                this._oscillatorNodeRenderer.periodicWave = null;
            }
        }

        public setPeriodicWave (periodicWave: PeriodicWave): void {
            this._nativeOscillatorNode.setPeriodicWave(periodicWave);

            if (this._oscillatorNodeRenderer !== null) {
                this._oscillatorNodeRenderer.periodicWave = periodicWave;
            }
        }

        public start (when = 0): void {
            this._nativeOscillatorNode.start(when);

            if (this._oscillatorNodeRenderer !== null) {
                this._oscillatorNodeRenderer.start = when;
            } else {
                setInternalState(this, 'active');

                const setInternalStateToPassive = () => {
                    this._nativeOscillatorNode.removeEventListener('ended', setInternalStateToPassive);

                    // @todo Determine a meaningful delay instead of just using one second.
                    setTimeout(() => setInternalState(this, 'passive'), 1000);
                };

                this._nativeOscillatorNode.addEventListener('ended', setInternalStateToPassive);
            }
        }

        public stop (when = 0): void {
            this._nativeOscillatorNode.stop(when);

            if (this._oscillatorNodeRenderer !== null) {
                this._oscillatorNodeRenderer.stop = when;
            }
        }

    };

};
