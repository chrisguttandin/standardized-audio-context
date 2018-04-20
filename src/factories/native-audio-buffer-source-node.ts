import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { cacheTestResult } from '../helpers/cache-test-result';
import {
    testAudioBufferSourceNodeStartMethodConsecutiveCallsSupport
} from '../support-testers/audio-buffer-source-node-start-method-consecutive-calls';
import {
    testAudioScheduledSourceNodeStartMethodNegativeParametersSupport
} from '../support-testers/audio-scheduled-source-node-start-method-negative-parameters';
import {
    testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport
} from '../support-testers/audio-scheduled-source-node-stop-method-consecutive-calls';
import {
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport
} from '../support-testers/audio-scheduled-source-node-stop-method-negative-parameters';
import { TNativeAudioBufferSourceNodeFactory } from '../types';
import { wrapAudioBufferSourceNodeStartMethodConsecutiveCalls } from '../wrappers/audio-buffer-source-node-start-method-consecutive-calls';
import {
    wrapAudioScheduledSourceNodeStartMethodNegativeParameters
} from '../wrappers/audio-scheduled-source-node-start-method-negative-parameters';
import {
    wrapAudioScheduledSourceNodeStopMethodConsecutiveCalls
} from '../wrappers/audio-scheduled-source-node-stop-method-consecutive-calls';
import {
    wrapAudioScheduledSourceNodeStopMethodNegativeParameters
} from '../wrappers/audio-scheduled-source-node-stop-method-negative-parameters';

export const createNativeAudioBufferSourceNode: TNativeAudioBufferSourceNodeFactory = (nativeContext, options = { }) => {
    const nativeAudioBufferSourceNode = nativeContext.createBufferSource();

    assignNativeAudioNodeOptions(nativeAudioBufferSourceNode, options);

    // Bug #71: Edge does not allow to set the buffer to null.
    if (options.buffer !== undefined && options.buffer !== null) {
        nativeAudioBufferSourceNode.buffer = options.buffer;
    }

    // @todo if (options.detune !== undefined) {
    // @todo    nativeAudioBufferSourceNode.detune.value = options.detune;
    // @todo }

    if (options.loop !== undefined) {
        nativeAudioBufferSourceNode.loop = options.loop;
    }

    if (options.loopEnd !== undefined) {
        nativeAudioBufferSourceNode.loopEnd = options.loopEnd;
    }

    if (options.loopStart !== undefined) {
        nativeAudioBufferSourceNode.loopStart = options.loopStart;
    }

    if (options.playbackRate !== undefined) {
        nativeAudioBufferSourceNode.playbackRate.value = options.playbackRate;
    }

    // Bug #69: Safari does allow calls to start() of an already scheduled AudioBufferSourceNode.
    if (!cacheTestResult(
        testAudioBufferSourceNodeStartMethodConsecutiveCallsSupport,
        () => testAudioBufferSourceNodeStartMethodConsecutiveCallsSupport(nativeContext)
    )) {
        wrapAudioBufferSourceNodeStartMethodConsecutiveCalls(nativeAudioBufferSourceNode);
    }

    // Bug #44: Only Chrome & Opera throw a RangeError yet.
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

    // Bug #44: No browser does throw a RangeError yet.
    if (!cacheTestResult(
        testAudioScheduledSourceNodeStopMethodNegativeParametersSupport,
        () => testAudioScheduledSourceNodeStopMethodNegativeParametersSupport(nativeContext)
    )) {
        wrapAudioScheduledSourceNodeStopMethodNegativeParameters(nativeAudioBufferSourceNode);
    }

    return nativeAudioBufferSourceNode;
};
