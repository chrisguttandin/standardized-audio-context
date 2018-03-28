import { Injector } from '@angular/core';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { cacheTestResult } from '../helpers/cache-test-result';
import { IOscillatorOptions } from '../interfaces';
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
import { TNativeOscillatorNode, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';
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
        AUDIO_SCHEDULED_SOURCE_NODE_START_METHOD_NEGATIVE_PARAMETERS_SUPPORT_TESTER_PROVIDER,
        AUDIO_SCHEDULED_SOURCE_NODE_START_METHOD_NEGATIVE_PARAMETERS_WRAPPER_PROVIDER,
        AUDIO_SCHEDULED_SOURCE_NODE_STOP_METHOD_CONSECUTIVE_CALLS_SUPPORT_TESTER_PROVIDER,
        AUDIO_SCHEDULED_SOURCE_NODE_STOP_METHOD_CONSECUTIVE_CALLS_WRAPPER_PROVIDER,
        AUDIO_SCHEDULED_SOURCE_NODE_STOP_METHOD_NEGATIVE_PARAMETERS_SUPPORT_TESTER_PROVIDER,
        AUDIO_SCHEDULED_SOURCE_NODE_STOP_METHOD_NEGATIVE_PARAMETERS_WRAPPER_PROVIDER
    ]
});

const startMethodNegativeParametersSupportTester = injector.get(AudioScheduledSourceNodeStartMethodNegativeParametersSupportTester);
const startMethodNegativeParametersWrapper = injector.get(AudioScheduledSourceNodeStartMethodNegativeParametersWrapper);
const stopMethodConsecutiveCallsSupportTester = injector.get(AudioScheduledSourceNodeStopMethodConsecutiveCallsSupportTester);
const stopMethodConsecutiveCallsWrapper = injector.get(AudioScheduledSourceNodeStopMethodConsecutiveCallsWrapper);
const stopMethodNegativeParametersSupportTester = injector.get(AudioScheduledSourceNodeStopMethodNegativeParametersSupportTester);
const stopMethodNegativeParametersWrapper = injector.get(AudioScheduledSourceNodeStopMethodNegativeParametersWrapper);

export const createNativeOscillatorNode = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options: Partial<IOscillatorOptions> = { }
): TNativeOscillatorNode => {
    const nativeNode = nativeContext.createOscillator();

    assignNativeAudioNodeOptions(nativeNode, options);

    if (options.detune !== undefined) {
        nativeNode.detune.value = options.detune;
    }

    if (options.frequency !== undefined) {
        nativeNode.frequency.value = options.frequency;
    }

    // @todo periodicWave

    if (options.type !== undefined) {
        nativeNode.type = options.type;
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
