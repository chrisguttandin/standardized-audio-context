import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { ReflectiveInjector } from '@angular/core';
import { cacheTestResult } from '../helpers/cache-test-result';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IAnalyserNode, IAnalyserOptions, IMinimalBaseAudioContext } from '../interfaces';
import { AnalyserNodeGetFloatTimeDomainDataSupportTester } from '../testers/analyser-node-get-float-time-domain-data';
import {
    TChannelCountMode,
    TChannelInterpretation,
    TNativeAnalyserNode,
    TUnpatchedAudioContext,
    TUnpatchedOfflineAudioContext
} from '../types';
import { AnalyserNodeGetFloatTimeDomainDataMethodWrapper } from '../wrappers/analyser-node-get-float-time-domain-data-method';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const DEFAULT_OPTIONS: IAnalyserOptions = {
    channelCount: 1,
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    fftSize: 2048,
    maxDecibels: -30,
    minDecibels: -100,
    numberOfInputs: 1,
    numberOfOutputs: 1,
    smoothingTimeConstant: 0.8
};

const injector = ReflectiveInjector.resolveAndCreate([
    AnalyserNodeGetFloatTimeDomainDataMethodWrapper,
    AnalyserNodeGetFloatTimeDomainDataSupportTester
]);

const analyserNodeGetFloatTimeDomainDataMethodWrapper = injector.get(AnalyserNodeGetFloatTimeDomainDataMethodWrapper);
const analyserNodeGetFloatTimeDomainDataSupportTester = injector.get(AnalyserNodeGetFloatTimeDomainDataSupportTester);

const isSupportingAnalyserNodeGetFloatTimeDomainData = (context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext) => cacheTestResult(
    AnalyserNodeGetFloatTimeDomainDataSupportTester,
    () => analyserNodeGetFloatTimeDomainDataSupportTester.test(context)
);

const createNativeNode = (nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext) => {
    if (isOfflineAudioContext(nativeContext)) {
        throw new Error('This is not yet supported.');
    }

    const nativeNode =  nativeContext.createAnalyser();

    // Bug #37: Only Chrome, Firefox and Opera create an AnalyserNode with the default properties.
    if (nativeNode.channelCount === 2) {
        nativeNode.channelCount = 1;
    }

    // Bug #36: Safari does not support getFloatTimeDomainData() yet.
    if (!isSupportingAnalyserNodeGetFloatTimeDomainData(nativeContext)) {
        analyserNodeGetFloatTimeDomainDataMethodWrapper.wrap(nativeNode);
    }

    return nativeNode;
};

export class AnalyserNode extends NoneAudioDestinationNode implements IAnalyserNode {

    constructor (context: IMinimalBaseAudioContext, options: Partial<IAnalyserOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IAnalyserOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = createNativeNode(nativeContext);

        super(context, nativeNode, mergedOptions);
    }

    public get fftSize () {
        if (this._nativeNode !== null) {
            return (<TNativeAnalyserNode> this._nativeNode).fftSize;
        }

        throw new Error('The native (Offline)AudioContext is missing.');
    }

    public set fftSize (value) {
        if (this._nativeNode === null) {
            // @todo
        } else {
            (<TNativeAnalyserNode> this._nativeNode).fftSize = value;
        }
    }

    public get frequencyBinCount () {
        if (this._nativeNode !== null) {
            return (<TNativeAnalyserNode> this._nativeNode).frequencyBinCount;
        }

        throw new Error('The native (Offline)AudioContext is missing.');
    }

    public get maxDecibels () {
        if (this._nativeNode !== null) {
            return (<TNativeAnalyserNode> this._nativeNode).maxDecibels;
        }

        throw new Error('The native (Offline)AudioContext is missing.');
    }

    public set maxDecibels (value) {
        if (this._nativeNode === null) {
            // @todo
        } else {
            (<TNativeAnalyserNode> this._nativeNode).maxDecibels = value;
        }
    }

    public get minDecibels () {
        if (this._nativeNode !== null) {
            return (<TNativeAnalyserNode> this._nativeNode).minDecibels;
        }

        throw new Error('The native (Offline)AudioContext is missing.');
    }

    public set minDecibels (value) {
        if (this._nativeNode === null) {
            // @todo
        } else {
            (<TNativeAnalyserNode> this._nativeNode).minDecibels = value;
        }
    }

    public get smoothingTimeConstant () {
        if (this._nativeNode !== null) {
            return (<TNativeAnalyserNode> this._nativeNode).smoothingTimeConstant;
        }

        throw new Error('The native (Offline)AudioContext is missing.');
    }

    public set smoothingTimeConstant (value) {
        if (this._nativeNode === null) {
            // @todo
        } else {
            (<TNativeAnalyserNode> this._nativeNode).smoothingTimeConstant = value;
        }
    }

    public getByteFrequencyData (array: Uint8Array) {
        if (this._nativeNode === null) {
            throw new Error('The native (Offline)AudioContext is missing.');
        } else {
            (<TNativeAnalyserNode> this._nativeNode).getByteFrequencyData(array);
        }
    }

    public getByteTimeDomainData (array: Uint8Array) {
        if (this._nativeNode === null) {
            throw new Error('The native (Offline)AudioContext is missing.');
        } else {
            (<TNativeAnalyserNode> this._nativeNode).getByteTimeDomainData(array);
        }
    }

    public getFloatFrequencyData (array: Float32Array) {
        if (this._nativeNode === null) {
            throw new Error('The native (Offline)AudioContext is missing.');
        } else {
            (<TNativeAnalyserNode> this._nativeNode).getFloatFrequencyData(array);
        }
    }

    public getFloatTimeDomainData (array: Float32Array) {
        if (this._nativeNode === null) {
            throw new Error('The native (Offline)AudioContext is missing.');
        } else {
            (<TNativeAnalyserNode> this._nativeNode).getFloatTimeDomainData(array);
        }
    }

}
