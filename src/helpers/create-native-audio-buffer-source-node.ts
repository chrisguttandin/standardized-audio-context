import { Injector } from '@angular/core';
import { INVALID_STATE_ERROR_FACTORY_PROVIDER } from '../factories/invalid-state-error';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { cacheTestResult } from '../helpers/cache-test-result';
import { IAudioBufferSourceOptions } from '../interfaces';
import {
    AUDIO_SCHEDULED_SOURCE_NODE_START_METHOD_CONSECUTIVE_CALLS_SUPPORT_TESTER_PROVIDER,
    AudioScheduledSourceNodeStartMethodConsecutiveCallsSupportTester
} from '../support-testers/audio-scheduled-source-node-start-methods-consecutive-calls';
import {
    AUDIO_SCHEDULED_SOURCE_NODE_START_METHOD_NEGATIVE_PARAMETERS_SUPPORT_TESTER_PROVIDER,
    AudioScheduledSourceNodeStartMethodNegativeParametersSupportTester
} from '../support-testers/audio-scheduled-source-node-start-methods-negative-parameters';
import {
    AUDIO_SCHEDULED_SOURCE_NODE_STOP_METHOD_CONSECUTIVE_CALLS_SUPPORT_TESTER_PROVIDER,
    AudioScheduledSourceNodeStopMethodConsecutiveCallsSupportTester
} from '../support-testers/audio-scheduled-source-node-stop-methods-consecutive-calls';
import {
    AUDIO_SCHEDULED_SOURCE_NODE_STOP_METHOD_NEGATIVE_PARAMETERS_SUPPORT_TESTER_PROVIDER,
    AudioScheduledSourceNodeStopMethodNegativeParametersSupportTester
} from '../support-testers/audio-scheduled-source-node-stop-methods-negative-parameters';
import { TNativeAudioBufferSourceNode, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';
import {
    AUDIO_SCHEDULED_SOURCE_NODE_START_METHOD_CONSECUTIVE_CALLS_WRAPPER_PROVIDER,
    AudioScheduledSourceNodeStartMethodConsecutiveCallsWrapper
} from '../wrappers/audio-scheduled-source-node-start-method-consecutive-calls';
import {
    AUDIO_SCHEDULED_SOURCE_NODE_START_METHOD_NEGATIVE_PARAMETERS_WRAPPER_PROVIDER,
    AudioScheduledSourceNodeStartMethodNegativeParametersWrapper
} from '../wrappers/audio-scheduled-source-node-start-method-negative-parameters';
import {
    AUDIO_SCHEDULED_SOURCE_NODE_STOP_METHOD_CONSECUTIVE_CALLS_WRAPPER_PROVIDER,
    AudioScheduledSourceNodeStopMethodConsecutiveCallsWrapper
} from '../wrappers/audio-scheduled-source-node-stop-method-consecutive-calls';
import {
    AUDIO_SCHEDULED_SOURCE_NODE_STOP_METHOD_NEGATIVE_PARAMETERS_WRAPPER_PROVIDER,
    AudioScheduledSourceNodeStopMethodNegativeParametersWrapper
} from '../wrappers/audio-scheduled-source-node-stop-method-negative-parameters';

const injector = Injector.create({
    providers: [
        AUDIO_SCHEDULED_SOURCE_NODE_START_METHOD_CONSECUTIVE_CALLS_SUPPORT_TESTER_PROVIDER,
        AUDIO_SCHEDULED_SOURCE_NODE_START_METHOD_CONSECUTIVE_CALLS_WRAPPER_PROVIDER,
        AUDIO_SCHEDULED_SOURCE_NODE_START_METHOD_NEGATIVE_PARAMETERS_SUPPORT_TESTER_PROVIDER,
        AUDIO_SCHEDULED_SOURCE_NODE_START_METHOD_NEGATIVE_PARAMETERS_WRAPPER_PROVIDER,
        AUDIO_SCHEDULED_SOURCE_NODE_STOP_METHOD_CONSECUTIVE_CALLS_SUPPORT_TESTER_PROVIDER,
        AUDIO_SCHEDULED_SOURCE_NODE_STOP_METHOD_CONSECUTIVE_CALLS_WRAPPER_PROVIDER,
        AUDIO_SCHEDULED_SOURCE_NODE_STOP_METHOD_NEGATIVE_PARAMETERS_SUPPORT_TESTER_PROVIDER,
        AUDIO_SCHEDULED_SOURCE_NODE_STOP_METHOD_NEGATIVE_PARAMETERS_WRAPPER_PROVIDER,
        INVALID_STATE_ERROR_FACTORY_PROVIDER
    ]
});

const startMethodConsecutiveCallsSupportTester = injector.get(AudioScheduledSourceNodeStartMethodConsecutiveCallsSupportTester);
const startMethodConsecutiveCallsWrapper = injector
    .get<AudioScheduledSourceNodeStartMethodConsecutiveCallsWrapper>(AudioScheduledSourceNodeStartMethodConsecutiveCallsWrapper);
const startMethodNegativeParametersSupportTester = injector.get(AudioScheduledSourceNodeStartMethodNegativeParametersSupportTester);
const startMethodNegativeParametersWrapper = injector.get(AudioScheduledSourceNodeStartMethodNegativeParametersWrapper);
const stopMethodConsecutiveCallsSupportTester = injector.get(AudioScheduledSourceNodeStopMethodConsecutiveCallsSupportTester);
const stopMethodConsecutiveCallsWrapper = injector.get(AudioScheduledSourceNodeStopMethodConsecutiveCallsWrapper);
const stopMethodNegativeParametersSupportTester = injector.get(AudioScheduledSourceNodeStopMethodNegativeParametersSupportTester);
const stopMethodNegativeParametersWrapper = injector.get(AudioScheduledSourceNodeStopMethodNegativeParametersWrapper);

export const createNativeAudioBufferSourceNode = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options: Partial<IAudioBufferSourceOptions> = { }
): TNativeAudioBufferSourceNode => {
    const nativeNode = nativeContext.createBufferSource();

    assignNativeAudioNodeOptions(nativeNode, options);

    // Bug #71: Edge does not allow to set the buffer to null.
    if (options.buffer !== undefined && options.buffer !== null) {
        nativeNode.buffer = options.buffer;
    }

    // @todo if (options.detune !== undefined) {
    // @todo    nativeNode.detune.value = options.detune;
    // @todo }

    if (options.loop !== undefined) {
        nativeNode.loop = options.loop;
    }

    if (options.loopEnd !== undefined) {
        nativeNode.loopEnd = options.loopEnd;
    }

    if (options.loopStart !== undefined) {
        nativeNode.loopStart = options.loopStart;
    }

    if (options.playbackRate !== undefined) {
        nativeNode.playbackRate.value = options.playbackRate;
    }

    // Bug #69: Safari does allow calls to start() of an already scheduled AudioBufferSourceNode.
    if (!cacheTestResult(
        AudioScheduledSourceNodeStartMethodConsecutiveCallsSupportTester,
        () => startMethodConsecutiveCallsSupportTester.test(nativeContext)
    )) {
        startMethodConsecutiveCallsWrapper.wrap(nativeNode);
    }

    // Bug #44: Only Chrome & Opera throw a RangeError yet.
    if (!cacheTestResult(
        AudioScheduledSourceNodeStartMethodNegativeParametersSupportTester,
        () => startMethodNegativeParametersSupportTester.test(nativeContext)
    )) {
        startMethodNegativeParametersWrapper.wrap(nativeNode);
    }

    // Bug #19: Safari does not ignore calls to stop() of an already stopped AudioBufferSourceNode.
    if (!cacheTestResult(
        AudioScheduledSourceNodeStopMethodConsecutiveCallsSupportTester,
        () => stopMethodConsecutiveCallsSupportTester.test(nativeContext)
    )) {
        stopMethodConsecutiveCallsWrapper.wrap(nativeNode, nativeContext);
    }

    // Bug #44: No browser does throw a RangeError yet.
    if (!cacheTestResult(
        AudioScheduledSourceNodeStopMethodNegativeParametersSupportTester,
        () => stopMethodNegativeParametersSupportTester.test(nativeContext)
    )) {
        stopMethodNegativeParametersWrapper.wrap(nativeNode);
    }

    return nativeNode;
};
