import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { cacheTestResult } from '../helpers/cache-test-result';
import {
    testAudioScheduledSourceNodeStartMethodNegativeParametersSupport
} from '../support-testers/audio-scheduled-source-node-start-method-negative-parameters';
import {
    testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport
} from '../support-testers/audio-scheduled-source-node-stop-method-consecutive-calls';
import {
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport
} from '../support-testers/audio-scheduled-source-node-stop-method-negative-parameters';
import { TNativeOscillatorNodeFactory } from '../types';
import {
    wrapAudioScheduledSourceNodeStartMethodNegativeParameters
} from '../wrappers/audio-scheduled-source-node-start-method-negative-parameters';
import {
    wrapAudioScheduledSourceNodeStopMethodConsecutiveCalls
} from '../wrappers/audio-scheduled-source-node-stop-method-consecutive-calls';
import {
    wrapAudioScheduledSourceNodeStopMethodNegativeParameters
} from '../wrappers/audio-scheduled-source-node-stop-method-negative-parameters';

export const createNativeOscillatorNode: TNativeOscillatorNodeFactory = (nativeContext, options) => {
    const nativeOscillatorNode = nativeContext.createOscillator();

    assignNativeAudioNodeOptions(nativeOscillatorNode, options);

    if (options.detune !== nativeOscillatorNode.detune.value) {
        nativeOscillatorNode.detune.value = options.detune;
    }

    if (options.frequency !== nativeOscillatorNode.frequency.value) {
        nativeOscillatorNode.frequency.value = options.frequency;
    }

    // @todo periodicWave

    if (options.type !== nativeOscillatorNode.type) {
        nativeOscillatorNode.type = options.type;
    }

    // Bug #44: Only Chrome & Opera throw a RangeError yet.
    if (!cacheTestResult(
        testAudioScheduledSourceNodeStartMethodNegativeParametersSupport,
        () => testAudioScheduledSourceNodeStartMethodNegativeParametersSupport(nativeContext)
    )) {
        wrapAudioScheduledSourceNodeStartMethodNegativeParameters(nativeOscillatorNode);
    }

    // Bug #19: Safari does not ignore calls to stop() of an already stopped AudioBufferSourceNode.
    if (!cacheTestResult(
        testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport,
        () => testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport(nativeContext)
    )) {
        wrapAudioScheduledSourceNodeStopMethodConsecutiveCalls(nativeOscillatorNode, nativeContext);
    }

    // Bug #44: No browser does throw a RangeError yet.
    if (!cacheTestResult(
        testAudioScheduledSourceNodeStopMethodNegativeParametersSupport,
        () => testAudioScheduledSourceNodeStopMethodNegativeParametersSupport(nativeContext)
    )) {
        wrapAudioScheduledSourceNodeStopMethodNegativeParameters(nativeOscillatorNode);
    }

    return nativeOscillatorNode;
};
