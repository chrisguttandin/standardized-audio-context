import { Injector } from '@angular/core';
import { cacheTestResult } from '../helpers/cache-test-result';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IAnalyserNode, IAnalyserOptions, IMinimalBaseAudioContext } from '../interfaces';
import {
    ANALYSER_NODE_GET_FLOAT_TIME_DOMAIN_DATA_SUPPORT_TESTER_PROVIDER,
    AnalyserNodeGetFloatTimeDomainDataSupportTester } from '../support-testers/analyser-node-get-float-time-domain-data';
import {
    TChannelCountMode,
    TChannelInterpretation,
    TNativeAnalyserNode,
    TUnpatchedAudioContext,
    TUnpatchedOfflineAudioContext
} from '../types';
import {
    ANALYSER_NODE_GET_FLOAT_TIME_DOMAIN_DATA_METHOD_WRAPPER_PROVIDER,
    AnalyserNodeGetFloatTimeDomainDataMethodWrapper
} from '../wrappers/analyser-node-get-float-time-domain-data-method';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const DEFAULT_OPTIONS: IAnalyserOptions = {
    channelCount: 2,
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    fftSize: 2048,
    maxDecibels: -30,
    minDecibels: -100,
    smoothingTimeConstant: 0.8
};

const injector = Injector.create({
    providers: [
        ANALYSER_NODE_GET_FLOAT_TIME_DOMAIN_DATA_METHOD_WRAPPER_PROVIDER,
        ANALYSER_NODE_GET_FLOAT_TIME_DOMAIN_DATA_SUPPORT_TESTER_PROVIDER
    ]
});

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

    const nativeNode = nativeContext.createAnalyser();

    // Bug #37: Only Edge and Safari create an AnalyserNode with the default properties.
    if (nativeNode.channelCount === 1) {
        nativeNode.channelCount = 2;
    }

    // Bug #36: Safari does not support getFloatTimeDomainData() yet.
    if (!isSupportingAnalyserNodeGetFloatTimeDomainData(nativeContext)) {
        analyserNodeGetFloatTimeDomainDataMethodWrapper.wrap(nativeNode);
    }

    return nativeNode;
};

export class AnalyserNode extends NoneAudioDestinationNode<TNativeAnalyserNode> implements IAnalyserNode {

    constructor (context: IMinimalBaseAudioContext, options: Partial<IAnalyserOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const { channelCount } = <IAnalyserOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = createNativeNode(nativeContext);

        super(context, nativeNode, channelCount);
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

}
