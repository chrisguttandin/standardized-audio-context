import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { Injector } from '@angular/core'; // tslint:disable-line:ordered-imports
import { RENDERER_STORE } from '../globals';
import { IAudioDestinationNode, IAudioNodeRenderer, IOfflineAudioCompletionEvent } from '../interfaces';
import { PROMISE_SUPPORT_TESTER_PROVIDER, PromiseSupportTester } from '../support-testers/promise';
import { TNativeAudioBuffer, TUnpatchedOfflineAudioContext } from '../types';
import { cacheTestResult } from './cache-test-result';

const injector = Injector.create([
    PROMISE_SUPPORT_TESTER_PROVIDER
]);

const promiseSupportTester = injector.get(PromiseSupportTester);

const isSupportingPromises = (context: TUnpatchedOfflineAudioContext) => cacheTestResult(
    PromiseSupportTester,
    () => promiseSupportTester.test(context)
);

export const startRendering = (
    destination: IAudioDestinationNode, unpatchedOfflineAudioContext: TUnpatchedOfflineAudioContext
): Promise<TNativeAudioBuffer> => {
    const audioDestinationNodeRenderer = <IAudioNodeRenderer> RENDERER_STORE.get(destination);

    if (audioDestinationNodeRenderer === undefined) {
        throw new Error('Missing the associated renderer.');
    }

    return audioDestinationNodeRenderer
        .render(unpatchedOfflineAudioContext)
        .then(() => {
            // Bug #21: Safari does not support promises yet.
            if (isSupportingPromises(unpatchedOfflineAudioContext)) {
                return unpatchedOfflineAudioContext.startRendering();
            }

            return new Promise<AudioBuffer>((resolve) => {
                unpatchedOfflineAudioContext.oncomplete = (event: IOfflineAudioCompletionEvent) => {
                    resolve(event.renderedBuffer);
                };

                // Bug #48: Safari does not render an OfflineAudioContext without any connected node.
                unpatchedOfflineAudioContext
                    .createGain()
                    .connect(unpatchedOfflineAudioContext.destination);

                unpatchedOfflineAudioContext.startRendering();
            });
        });
};
