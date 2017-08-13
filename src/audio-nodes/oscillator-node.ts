import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IMinimalBaseAudioContext, IOscillatorNode, IOscillatorOptions } from '../interfaces';
import {
    TChannelCountMode,
    TChannelInterpretation,
    TEndedEventHandler,
    TNativeOscillatorNode,
    TOscillatorType,
    TUnpatchedAudioContext,
    TUnpatchedOfflineAudioContext
} from '../types';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const DEFAULT_OPTIONS = {
    channelCount: 2,
    channelCountMode: <TChannelCountMode> 'max', // This attribute has no effect for nodes with no inputs.
    channelInterpretation: <TChannelInterpretation> 'speakers', // This attribute has no effect for nodes with no inputs.
    detune: 0,
    frequency: 440,
    numberOfInputs: 0,
    numberOfOutputs: 1,
    type: <TOscillatorType> 'sine'
};

const createNativeNode = (nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext) => {
    if (isOfflineAudioContext(nativeContext)) {
        throw new Error('This is not yet supported.');
    }

    return nativeContext.createOscillator();
};

export class OscillatorNode extends NoneAudioDestinationNode implements IOscillatorNode {

    constructor (context: IMinimalBaseAudioContext, options: Partial<IOscillatorOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IOscillatorOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = createNativeNode(nativeContext);

        super(context, nativeNode, mergedOptions);
    }

    public get detune (): AudioParam {
        if (this._nativeNode !== null) {
            return (<TNativeOscillatorNode> this._nativeNode).detune;
        }

        throw new Error('This is not yet supported.');
    }

    public get frequency (): AudioParam {
        if (this._nativeNode !== null) {
            return (<TNativeOscillatorNode> this._nativeNode).frequency;
        }

        throw new Error('This is not yet supported.');
    }

    public get onended (): null | TEndedEventHandler {
        // @todo
        return (this._nativeNode === null) ? null : (<any> this._nativeNode).onended;
    }

    public set onended (value: null | TEndedEventHandler) {
        if (this._nativeNode === null) {
            // @todo
        } else {
            (<any> this._nativeNode).onended = value;
        }
    }

    public get type (): TOscillatorType {
        if (this._nativeNode !== null) {
            return (<TNativeOscillatorNode> this._nativeNode).type;
        }

        throw new Error('This is not yet supported.');
    }

    public setPeriodicWave (periodicWave: PeriodicWave) {
        if (this._nativeNode === null) {
            throw new Error('This is not yet supported.');
        } else {
            (<TNativeOscillatorNode> this._nativeNode).setPeriodicWave(periodicWave);
        }
    }

    public start (when = 0) {
        if (this._nativeNode === null) {
            throw new Error('This is not yet supported.');
        } else {
            (<TNativeOscillatorNode> this._nativeNode).start(when);
        }
    }

    public stop (when = 0) {
        if (this._nativeNode === null) {
            throw new Error('This is not yet supported.');
        } else {
            (<TNativeOscillatorNode> this._nativeNode).stop(when);
        }
    }

}
