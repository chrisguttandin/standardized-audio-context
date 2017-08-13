import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { ReflectiveInjector } from '@angular/core';
import { InvalidAccessErrorFactory } from '../factories/invalid-access-error';
import { InvalidStateErrorFactory } from '../factories/invalid-state-error';
import { NotSupportedErrorFactory } from '../factories/not-supported-error';
import { IIRFilterNodeFaker } from '../fakers/iir-filter-node';
import { RENDERER_STORE } from '../globals';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IIIRFilterNode, IIIRFilterOptions, IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';
import { IIRFilterNodeRenderer } from '../renderers/iir-filter-node';
import {
    TChannelCountMode,
    TChannelInterpretation,
    TNativeIIRFilterNode,
    TTypedArray,
    TUnpatchedAudioContext,
    TUnpatchedOfflineAudioContext
} from '../types';
import { IIRFilterNodeGetFrequencyResponseMethodWrapper } from '../wrappers/iir-filter-node-get-frequency-response-method';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

function divide (a: [ number, number ], b: [ number, number ]): [ number, number ] {
    const denominator = (b[0] * b[0]) + (b[1] * b[1]);

    return [ (((a[0] * b[0]) + (a[1] * b[1])) / denominator), (((a[1] * b[0]) - (a[0] * b[1])) / denominator) ];
}

function multiply (a: [ number, number ], b: [ number, number ]): [ number, number ] {
    return [ ((a[0] * b[0]) - (a[1] * b[1])), ((a[0] * b[1]) + (a[1] * b[0])) ];
}

function evaluatePolynomial (coefficient: number[] | TTypedArray, z: [ number, number ]) {
    let result: [ number, number ] = [ 0, 0 ];

    for (let i = coefficient.length - 1; i >= 0; i -= 1) {
        result = multiply(result, z);

        result[0] += coefficient[i];
    }

    return result;
}

// The DEFAULT_OPTIONS are only of type Partial<IIIRFilterOptions> because there are no default values for feedback and feedforward.
const DEFAULT_OPTIONS: Partial<IIIRFilterOptions> = {
    channelCount: 2, // @todo channelCount is not specified because it is ignored when the channelCountMode equals 'max'.
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    numberOfInputs: 1,
    numberOfOutputs: 1
};

const injector = ReflectiveInjector.resolveAndCreate([
    InvalidAccessErrorFactory,
    InvalidStateErrorFactory,
    IIRFilterNodeFaker,
    IIRFilterNodeGetFrequencyResponseMethodWrapper,
    NotSupportedErrorFactory
]);

const iIRFilterNodeFaker = injector.get(IIRFilterNodeFaker);
const iIRFilterNodeGetFrequencyResponseMethodWrapper = injector.get(IIRFilterNodeGetFrequencyResponseMethodWrapper);
const invalidStateErrorFactory = injector.get(InvalidStateErrorFactory);
const notSupportedErrorFactory = injector.get(NotSupportedErrorFactory);

const createNativeNode = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    feedback: number[] | TTypedArray,
    feedforward: number[] | TTypedArray,
    channelCount: number
) => {
    // Bug #9: Safari does not support IIRFilterNodes.
    if (nativeContext.createIIRFilter === undefined) {
        if (isOfflineAudioContext(nativeContext)) {
            return null;
        } else {
            return iIRFilterNodeFaker.fake(nativeContext, feedback, feedforward, channelCount);
        }
    }

    return nativeContext.createIIRFilter(<number[]> feedforward, <number[]> feedback);
};

export class IIRFilterNode extends NoneAudioDestinationNode implements IIIRFilterNode {

    private _feedback: number[] | TTypedArray;

    private _feedforward: number[] | TTypedArray;

    private _nyquist: number;

    constructor (context: IMinimalBaseAudioContext, options: Partial<IIIRFilterOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IIIRFilterOptions> { ...DEFAULT_OPTIONS, ...options };
        const { channelCount, feedback, feedforward } = mergedOptions;
        const nativeNode = createNativeNode(nativeContext, feedback, feedforward, channelCount);

        super(context, nativeNode, mergedOptions);

        this._feedback = feedback;
        this._feedforward = feedforward;
        this._nyquist = nativeContext.sampleRate / 2;

        if (nativeNode === null || nativeNode.getFrequencyResponse === undefined) {
            // Bug #9: Safari does not support IIRFilterNodes.

            if (feedback.length === 0 || feedback.length > 20) {
                throw notSupportedErrorFactory.create();
            }

            if (feedback[0] === 0) {
                throw invalidStateErrorFactory.create();
            }

            if (feedforward.length === 0 || feedforward.length > 20) {
                throw notSupportedErrorFactory.create();
            }

            if (feedforward[0] === 0) {
                throw invalidStateErrorFactory.create();
            }
        } else {
            // Bug #23 & #24: FirefoxDeveloper does not throw NotSupportedErrors anymore.
            // @todo Write a test which allows other browsers to remain unpatched.
            iIRFilterNodeGetFrequencyResponseMethodWrapper.wrap(nativeNode);
        }

        if (isOfflineAudioContext(nativeContext)) {
            const length = (<IMinimalOfflineAudioContext> context).length;
            const biquadFilterNodeRenderer = new IIRFilterNodeRenderer(this, feedback, feedforward, length);

            RENDERER_STORE.set(this, biquadFilterNodeRenderer);
        }
    }

    public getFrequencyResponse (frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array) {
        // Bug #9: Safari does not support IIRFilterNodes.
        if (this._nativeNode !== null && (<TNativeIIRFilterNode> this._nativeNode).getFrequencyResponse !== undefined) {
            return (<TNativeIIRFilterNode> this._nativeNode).getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
        }

        if (magResponse.length === 0 || phaseResponse.length === 0) {
            throw notSupportedErrorFactory.create();
        }

        const length = frequencyHz.length;

        for (let i = 0; i < length; i += 1) {
            const omega = -Math.PI * (frequencyHz[i] / this._nyquist);
            const z: [ number, number ] = [ Math.cos(omega), Math.sin(omega) ];
            const numerator = evaluatePolynomial(this._feedforward, z);
            const denominator = evaluatePolynomial(this._feedback, z);
            const response = divide(numerator, denominator);

            magResponse[i] = Math.sqrt((response[0] * response[0]) + (response[1] * response[1]));
            phaseResponse[i] = Math.atan2(response[1], response[0]);
        }
    }

}
