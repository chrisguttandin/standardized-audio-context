import { Injector } from '@angular/core';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { cacheTestResult } from '../helpers/cache-test-result';
import { IAnalyserOptions } from '../interfaces';
import {
    ANALYSER_NODE_GET_FLOAT_TIME_DOMAIN_DATA_SUPPORT_TESTER_PROVIDER,
    AnalyserNodeGetFloatTimeDomainDataSupportTester
} from '../support-testers/analyser-node-get-float-time-domain-data';
import { TNativeAnalyserNode, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';
import {
    ANALYSER_NODE_GET_FLOAT_TIME_DOMAIN_DATA_METHOD_WRAPPER_PROVIDER,
    AnalyserNodeGetFloatTimeDomainDataMethodWrapper
} from '../wrappers/analyser-node-get-float-time-domain-data-method';

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

export const createNativeAnalyserNode = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options: Partial<IAnalyserOptions> = { }
): TNativeAnalyserNode => {
    const nativeNode = nativeContext.createAnalyser();

    assignNativeAudioNodeOptions(nativeNode, options);

    if (options.fftSize !== undefined) {
        nativeNode.fftSize = options.fftSize;
    }

    if (options.maxDecibels !== undefined) {
        nativeNode.maxDecibels = options.maxDecibels;
    }

    if (options.minDecibels !== undefined) {
        nativeNode.minDecibels = options.minDecibels;
    }

    if (options.smoothingTimeConstant !== undefined) {
        nativeNode.smoothingTimeConstant = options.smoothingTimeConstant;
    }

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
