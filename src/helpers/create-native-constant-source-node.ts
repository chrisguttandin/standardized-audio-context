import { Injector } from '@angular/core';
import { CONSTANT_SOURCE_NODE_FAKER_PROVIDER, ConstantSourceNodeFaker } from '../fakers/constant-source-node';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { cacheTestResult } from '../helpers/cache-test-result';
import { IConstantSourceOptions, INativeConstantSourceNode } from '../interfaces';
import {
    AUDIO_SCHEDULED_SOURCE_NODE_START_METHOD_NEGATIVE_PARAMETERS_SUPPORT_TESTER_PROVIDER,
    AudioScheduledSourceNodeStartMethodNegativeParametersSupportTester
} from '../support-testers/audio-scheduled-source-node-start-method-negative-parameters';
import {
    AUDIO_SCHEDULED_SOURCE_NODE_STOP_METHOD_NEGATIVE_PARAMETERS_SUPPORT_TESTER_PROVIDER,
    AudioScheduledSourceNodeStopMethodNegativeParametersSupportTester
} from '../support-testers/audio-scheduled-source-node-stop-method-negative-parameters';
import {
    CONSTANT_SOURCE_NODE_ACCURATE_SCHEDULING_SUPPORT_TESTER_PROVIDER,
    ConstantSourceNodeAccurateSchedulingSupportTester
} from '../support-testers/constant-source-node-accurate-scheduling';
import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';
import {
    wrapAudioScheduledSourceNodeStartMethodNegativeParameters
} from '../wrappers/audio-scheduled-source-node-start-method-negative-parameters';
import {
    wrapAudioScheduledSourceNodeStopMethodNegativeParameters
} from '../wrappers/audio-scheduled-source-node-stop-method-negative-parameters';
import {
    wrapConstantSourceNodeAccurateScheduling
} from '../wrappers/constant-source-node-accurate-scheduling';

const injector = Injector.create({
    providers: [
        AUDIO_SCHEDULED_SOURCE_NODE_START_METHOD_NEGATIVE_PARAMETERS_SUPPORT_TESTER_PROVIDER,
        AUDIO_SCHEDULED_SOURCE_NODE_STOP_METHOD_NEGATIVE_PARAMETERS_SUPPORT_TESTER_PROVIDER,
        CONSTANT_SOURCE_NODE_ACCURATE_SCHEDULING_SUPPORT_TESTER_PROVIDER,
        CONSTANT_SOURCE_NODE_FAKER_PROVIDER
    ]
});

const constantSourceNodeFaker = injector.get(ConstantSourceNodeFaker);
const accurateSchedulingSupportTester = injector.get(ConstantSourceNodeAccurateSchedulingSupportTester);
const startMethodNegativeParametersSupportTester = injector.get(AudioScheduledSourceNodeStartMethodNegativeParametersSupportTester);
const stopMethodNegativeParametersSupportTester = injector.get(AudioScheduledSourceNodeStopMethodNegativeParametersSupportTester);

export const createNativeConstantSourceNode = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options: Partial<IConstantSourceOptions> = { }
): INativeConstantSourceNode => {
    // Bug #62: Edge & Safari do not support ConstantSourceNodes.
    // @todo TypeScript doesn't know yet about createConstantSource().
    if ((<any> nativeContext).createConstantSource === undefined) {
        return constantSourceNodeFaker.fake(nativeContext, options);
    }

    const nativeNode = <INativeConstantSourceNode> (<any> nativeContext).createConstantSource();

    assignNativeAudioNodeOptions(nativeNode, options);

    // Bug #67: Firefox initializes the ConstantSourceNode with a channelCount of 1 instead of 2.
    if (nativeNode.channelCount === 1) {
        nativeNode.channelCount = 2;
    }

    if (options.offset !== undefined) {
        nativeNode.offset.value = options.offset;
    }

    // Bug #44: Only Chrome & Opera throw a RangeError yet.
    if (!cacheTestResult(
        AudioScheduledSourceNodeStartMethodNegativeParametersSupportTester,
        () => startMethodNegativeParametersSupportTester.test(nativeContext)
    )) {
        wrapAudioScheduledSourceNodeStartMethodNegativeParameters(nativeNode);
    }

    // Bug #44: No browser does throw a RangeError yet.
    if (!cacheTestResult(
        AudioScheduledSourceNodeStopMethodNegativeParametersSupportTester,
        () => stopMethodNegativeParametersSupportTester.test(nativeContext)
    )) {
        wrapAudioScheduledSourceNodeStopMethodNegativeParameters(nativeNode);
    }

    // Bug #70: Firefox does not schedule ConstantSourceNodes accurately.
    if (!cacheTestResult(
        ConstantSourceNodeAccurateSchedulingSupportTester,
        () => accurateSchedulingSupportTester.test(nativeContext)
    )) {
        wrapConstantSourceNodeAccurateScheduling(nativeNode, nativeContext);
    }

    return nativeNode;
};
