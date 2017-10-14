import 'core-js/es7/reflect';
import {
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    unpatchedOfflineAudioContextConstructor as nptchdFflnDCntxtCnstrctr
} from '../../src/providers/unpatched-offline-audio-context-constructor';
import { PromiseSupportTester } from '../../src/support-testers/promise';
import { ReflectiveInjector } from '@angular/core';
import { WINDOW_PROVIDER } from '../../src/providers/window';
import { cacheTestResult } from '../../src/helpers/cache-test-result';

const injector = ReflectiveInjector.resolveAndCreate([
    PromiseSupportTester,
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    WINDOW_PROVIDER
]);
const UnpatchedOfflineAudioContext = injector.get(nptchdFflnDCntxtCnstrctr);
const promiseSupportTester = injector.get(PromiseSupportTester);
const isSupportingPromises = (context) => cacheTestResult(PromiseSupportTester, () => promiseSupportTester.test(context));

export class PolyfillNodeRenderer {

    constructor (proxy) {
        this._nativeNode = null;
        this._proxy = proxy;
        this._sources = new Map();
    }

    render (offlineAudioContext) {
        if (this._nativeNode !== null) {
            return Promise.resolve(this._nativeNode);
        }

        const partialOfflineAudioContext = new UnpatchedOfflineAudioContext(
            // Bug #47: The AudioDestinationNode in Edge and Safari gets not initialized correctly.
            this._proxy.context.destination.channelCount,
            // Bug #17: Safari does not yet expose the length.
            this._proxy.context.length,
            offlineAudioContext.sampleRate
        );

        return this
            ._connectSources(partialOfflineAudioContext, partialOfflineAudioContext.destination)
            .then(() => {
                // Bug #21: Safari does not support promises yet.
                if (isSupportingPromises(partialOfflineAudioContext)) {
                    return partialOfflineAudioContext.startRendering();
                }

                return new Promise((resolve) => {
                    partialOfflineAudioContext.oncomplete = (event) => {
                        resolve(event.renderedBuffer);
                    };

                    partialOfflineAudioContext.startRendering();
                });
            })
            .then((renderedBuffer) => {
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                audioBufferSourceNode.buffer = renderedBuffer;
                audioBufferSourceNode.start(0);

                return audioBufferSourceNode;
            });
    }

    unwire (source) {
        this._sources.delete(source);
    }

    wire (source, output, input) {
        this._sources.set(source, { input, output });
    }

    _connectSources (offlineAudioContext, nativeNode) {
        return Promise
            .all(Array
                .from(this._sources)
                .map(([ source, { input, output } ]) => {
                    /*
                     * For some reason this currently needs to be a function body with a return statement.
                     * The shortcut syntax causes an error.
                     */
                    return source
                        .render(offlineAudioContext)
                        .then((node) => node.connect(nativeNode, output, input));
                }));
    }

}
