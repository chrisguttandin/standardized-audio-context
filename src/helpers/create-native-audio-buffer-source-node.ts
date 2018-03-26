import { Injector } from '@angular/core';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { cacheTestResult } from '../helpers/cache-test-result';
import { IAudioBufferSourceOptions } from '../interfaces';
import { STOP_STOPPED_SUPPORT_TESTER_PROVIDER, StopStoppedSupportTester } from '../support-testers/stop-stopped';
import { TNativeAudioBufferSourceNode, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';
import {
    AUDIO_BUFFER_SOURCE_NODE_STOP_METHOD_WRAPPER_PROVIDER,
    AudioBufferSourceNodeStopMethodWrapper
} from '../wrappers/audio-buffer-source-node-stop-method';

const injector = Injector.create({
    providers: [
        AUDIO_BUFFER_SOURCE_NODE_STOP_METHOD_WRAPPER_PROVIDER,
        STOP_STOPPED_SUPPORT_TESTER_PROVIDER
    ]
});

const audioBufferSourceNodeStopMethodWrapper = injector.get(AudioBufferSourceNodeStopMethodWrapper);
const stopStoppedSupportTester = injector.get(StopStoppedSupportTester);

export const createNativeAudioBufferSourceNode = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options: Partial<IAudioBufferSourceOptions> = { }
): TNativeAudioBufferSourceNode => {
    const nativeNode = nativeContext.createBufferSource();

    assignNativeAudioNodeOptions(nativeNode, options);

    // Bug #19: Safari does not ignore calls to stop() of an already stopped AudioBufferSourceNode.
    if (!cacheTestResult(StopStoppedSupportTester, () => stopStoppedSupportTester.test(nativeContext))) {
        audioBufferSourceNodeStopMethodWrapper.wrap(nativeNode, nativeContext);
    }

    return nativeNode;
};
