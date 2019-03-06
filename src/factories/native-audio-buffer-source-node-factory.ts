import { assignNativeAudioNodeAudioParamValue } from '../helpers/assign-native-audio-node-audio-param-value';
import { assignNativeAudioNodeOption } from '../helpers/assign-native-audio-node-option';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { cacheTestResult } from '../helpers/cache-test-result';
import { TNativeAudioBufferSourceNodeFactoryFactory } from '../types';
import { wrapAudioBufferSourceNodeStartMethodConsecutiveCalls } from '../wrappers/audio-buffer-source-node-start-method-consecutive-calls';
import {
    wrapAudioBufferSourceNodeStartMethodDurationParameter
} from '../wrappers/audio-buffer-source-node-start-method-duration-parameter';
import {
    wrapAudioScheduledSourceNodeStartMethodNegativeParameters
} from '../wrappers/audio-scheduled-source-node-start-method-negative-parameters';
import {
    wrapAudioScheduledSourceNodeStopMethodNegativeParameters
} from '../wrappers/audio-scheduled-source-node-stop-method-negative-parameters';

export const createNativeAudioBufferSourceNodeFactory: TNativeAudioBufferSourceNodeFactoryFactory = (
    createNativeAudioNode,
    testAudioBufferSourceNodeStartMethodConsecutiveCallsSupport,
    testAudioBufferSourceNodeStartMethodDurationParameterSupport,
    testAudioScheduledSourceNodeStartMethodNegativeParametersSupport,
    testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport,
    wrapAudioScheduledSourceNodeStopMethodConsecutiveCalls
) => {
    return (nativeContext, options = { }) => {
        const nativeAudioBufferSourceNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createBufferSource());

        assignNativeAudioNodeOptions(nativeAudioBufferSourceNode, options);

        assignNativeAudioNodeAudioParamValue(nativeAudioBufferSourceNode, options, 'playbackRate');

        // Bug #71: Edge does not allow to set the buffer to null.
        assignNativeAudioNodeOption(nativeAudioBufferSourceNode, options, 'buffer');

        // Bug #149: Safari does not yet support the detune AudioParam.

        assignNativeAudioNodeOption(nativeAudioBufferSourceNode, options, 'loop');
        assignNativeAudioNodeOption(nativeAudioBufferSourceNode, options, 'loopEnd');
        assignNativeAudioNodeOption(nativeAudioBufferSourceNode, options, 'loopStart');

        // Bug #69: Safari does allow calls to start() of an already scheduled AudioBufferSourceNode.
        if (!cacheTestResult(
            testAudioBufferSourceNodeStartMethodConsecutiveCallsSupport,
            () => testAudioBufferSourceNodeStartMethodConsecutiveCallsSupport(nativeContext)
        )) {
            wrapAudioBufferSourceNodeStartMethodConsecutiveCalls(nativeAudioBufferSourceNode);
        }

        // Bug #92: Edge does not respect the duration parameter yet.
        if (!cacheTestResult(
            testAudioBufferSourceNodeStartMethodDurationParameterSupport,
            testAudioBufferSourceNodeStartMethodDurationParameterSupport
        )) {
            wrapAudioBufferSourceNodeStartMethodDurationParameter(nativeAudioBufferSourceNode, nativeContext);
        }

        // Bug #44: Only Chrome, Firefox & Opera throw a RangeError yet.
        if (!cacheTestResult(
            testAudioScheduledSourceNodeStartMethodNegativeParametersSupport,
            () => testAudioScheduledSourceNodeStartMethodNegativeParametersSupport(nativeContext)
        )) {
            wrapAudioScheduledSourceNodeStartMethodNegativeParameters(nativeAudioBufferSourceNode);
        }

        // Bug #19: Safari does not ignore calls to stop() of an already stopped AudioBufferSourceNode.
        if (!cacheTestResult(
            testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport,
            () => testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport(nativeContext)
        )) {
            wrapAudioScheduledSourceNodeStopMethodConsecutiveCalls(nativeAudioBufferSourceNode, nativeContext);
        }

        // Bug #44: Only Firefox does throw a RangeError yet.
        if (!cacheTestResult(
            testAudioScheduledSourceNodeStopMethodNegativeParametersSupport,
            () => testAudioScheduledSourceNodeStopMethodNegativeParametersSupport(nativeContext)
        )) {
            wrapAudioScheduledSourceNodeStopMethodNegativeParameters(nativeAudioBufferSourceNode);
        }

        return nativeAudioBufferSourceNode;
    };
};
