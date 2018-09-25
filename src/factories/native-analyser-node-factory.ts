import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { cacheTestResult } from '../helpers/cache-test-result';
import { testAnalyserNodeGetFloatTimeDomainDataMethodSupport } from '../support-testers/analyser-node-get-float-time-domain-data-method';
import { TNativeAnalyserNodeFactoryFactory } from '../types';
import { wrapAnalyserNodeGetFloatTimeDomainDataMethod } from '../wrappers/analyser-node-get-float-time-domain-data-method';

export const createNativeAnalyserNodeFactory: TNativeAnalyserNodeFactoryFactory = (createNativeAudioNode) => {
    return (nativeContext, options) => {
        const nativeAnalyserNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createAnalyser());

        assignNativeAudioNodeOptions(nativeAnalyserNode, options);

        if (options.fftSize !== nativeAnalyserNode.fftSize) {
            nativeAnalyserNode.fftSize = options.fftSize;
        }

        if (options.maxDecibels !== nativeAnalyserNode.maxDecibels) {
            nativeAnalyserNode.maxDecibels = options.maxDecibels;
        }

        if (options.minDecibels !== nativeAnalyserNode.minDecibels) {
            nativeAnalyserNode.minDecibels = options.minDecibels;
        }

        if (options.smoothingTimeConstant !== nativeAnalyserNode.smoothingTimeConstant) {
            nativeAnalyserNode.smoothingTimeConstant = options.smoothingTimeConstant;
        }

        // Bug #37: Only Edge and Safari create an AnalyserNode with the default properties.
        if (nativeAnalyserNode.channelCount === 1) {
            nativeAnalyserNode.channelCount = 2;
        }

        // Bug #36: Safari does not support getFloatTimeDomainData() yet.
        if (!cacheTestResult(
            testAnalyserNodeGetFloatTimeDomainDataMethodSupport,
            () => testAnalyserNodeGetFloatTimeDomainDataMethodSupport(nativeAnalyserNode)
        )) {
            wrapAnalyserNodeGetFloatTimeDomainDataMethod(nativeAnalyserNode);
        }

        return nativeAnalyserNode;
    };
};
