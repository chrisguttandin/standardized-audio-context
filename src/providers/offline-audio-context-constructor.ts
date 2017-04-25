import { OpaqueToken } from '@angular/core';
import { EncodingErrorFactory } from '../factories/encoding-error';
import { OfflineAudioBufferSourceNodeFakerFactory } from '../factories/offline-audio-buffer-source-node';
import { OfflineAudioDestinationNodeFakerFactory } from '../factories/offline-audio-destination-node';
import { OfflineBiquadFilterNodeFakerFactory } from '../factories/offline-biquad-filter-node';
import { OfflineGainNodeFakerFactory } from '../factories/offline-gain-node';
import { OfflineIIRFilterNodeFakerFactory } from '../factories/offline-iir-filter-node';
import { IOfflineAudioContext, IOfflineAudioContextConstructor } from '../interfaces/offline-audio-context';
import { AudioBufferCopyChannelMethodsSupportTester } from '../testers/audio-buffer-copy-channel-methods-support';
import { PromiseSupportTester } from '../testers/promise-support';
import { AudioBufferWrapper } from '../wrappers/audio-buffer';
import { AudioBufferCopyChannelMethodsWrapper } from '../wrappers/audio-buffer-copy-channel-methods';
import { IIRFilterNodeGetFrequencyResponseMethodWrapper } from '../wrappers/iir-filter-node-get-frequency-response-method';
import { unpatchedOfflineAudioContextConstructor } from './unpatched-offline-audio-context-constructor';

export const offlineAudioContextConstructor = new OpaqueToken('OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR');

export const OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER = {
    deps: [
        AudioBufferCopyChannelMethodsSupportTester,
        AudioBufferCopyChannelMethodsWrapper,
        AudioBufferWrapper,
        EncodingErrorFactory,
        IIRFilterNodeGetFrequencyResponseMethodWrapper,
        OfflineAudioBufferSourceNodeFakerFactory,
        OfflineAudioDestinationNodeFakerFactory,
        OfflineBiquadFilterNodeFakerFactory,
        OfflineGainNodeFakerFactory,
        OfflineIIRFilterNodeFakerFactory,
        PromiseSupportTester,
        unpatchedOfflineAudioContextConstructor
    ],
    provide: offlineAudioContextConstructor,
    useFactory: (
        audioBufferCopyChannelMethodsSupportTester,
        audioBufferCopyChannelMethodsWrapper,
        audioBufferWrapper,
        encodingErrorFactory,
        iIRFilterNodeGetFrequencyResponseMethodWrapper,
        offlineAudioBufferSourceNodeFakerFactory,
        offlineAudioDestinationNodeFakerFactory,
        offlineBiquadFilterNodeFakerFactory,
        offlineGainNodeFakerFactory,
        offlineIIRFilterNodeFakerFactory,
        promiseSupportTester,
        UnpatchedOfflineAudioContext // tslint:disable-line:variable-name
    ): IOfflineAudioContextConstructor => {
        class OfflineAudioContext implements IOfflineAudioContext {

            private _destination;

            private _fakeNodeStore;

            private _isSupportingCopyChannelMethods;

            private _isSupportingGetFrequencyResponseErrors;

            private _isSupportingPromises;

            private _length;

            private _numberOfChannels;

            private _unpatchedOfflineAudioContext;

            constructor (numberOfChannels, length, sampleRate) {
                const fakeNodeStore = new WeakMap();

                const unpatchedOfflineAudioContext = new UnpatchedOfflineAudioContext(numberOfChannels, length, sampleRate);

                this._destination = offlineAudioDestinationNodeFakerFactory.create({ fakeNodeStore });
                this._fakeNodeStore = fakeNodeStore;
                this._isSupportingCopyChannelMethods = audioBufferCopyChannelMethodsSupportTester.test(unpatchedOfflineAudioContext);
                this._isSupportingGetFrequencyResponseErrors = false;
                this._isSupportingPromises = promiseSupportTester.test(unpatchedOfflineAudioContext);
                this._length = length;
                this._numberOfChannels = numberOfChannels;
                this._unpatchedOfflineAudioContext = unpatchedOfflineAudioContext;
            }

            public get currentTime () {
                return this._unpatchedOfflineAudioContext.currentTime;
            }

            public get destination () {
                return this._destination.proxy;
            }

            public get length () {
                // Bug #17: Safari does not yet expose the length.
                if (this._unpatchedOfflineAudioContext.length === undefined) {
                    return this._length;
                }

                return this._unpatchedOfflineAudioContext.length;
            }

            public get sampleRate () {
                return this._unpatchedOfflineAudioContext.sampleRate;
            }

            public createBiquadFilter () {
                return offlineBiquadFilterNodeFakerFactory.create({
                    fakeNodeStore: this._fakeNodeStore,
                    nativeNode: this._unpatchedOfflineAudioContext.createBiquadFilter()
                }).proxy;
            }

            public createBuffer (numberOfChannels, length, sampleRate) {
                // @todo Consider browsers which do not fully support this method yet.
                return this._unpatchedOfflineAudioContext.createBuffer(numberOfChannels, length, sampleRate);
            }

            public createBufferSource () {
                return offlineAudioBufferSourceNodeFakerFactory.create({
                    fakeNodeStore: this._fakeNodeStore
                }).proxy;
            }

            public createGain () {
                return offlineGainNodeFakerFactory.create({
                    fakeNodeStore: this._fakeNodeStore
                }).proxy;
            }

            public createIIRFilter (feedforward, feedback) {
                let nativeNode = null;

                // Bug #9: Safari does not support IIRFilterNodes.
                if (this._unpatchedOfflineAudioContext.createIIRFilter !== undefined) {
                    nativeNode = this._unpatchedOfflineAudioContext.createIIRFilter(feedforward, feedback);

                    // Bug 23 & 24: FirefoxDeveloper does not throw NotSupportedErrors anymore.
                    if (!this._isSupportingGetFrequencyResponseErrors) {
                        iIRFilterNodeGetFrequencyResponseMethodWrapper.wrap(nativeNode);
                    }
                }

                return offlineIIRFilterNodeFakerFactory.create({
                    fakeNodeStore: this._fakeNodeStore,
                    feedback,
                    feedforward,
                    length: this.length,
                    nativeNode,
                    numberOfChannels: this._numberOfChannels,
                    sampleRate: this._unpatchedOfflineAudioContext.sampleRate
                }).proxy;
            }

            public decodeAudioData (audioData, successCallback, errorCallback) {
                // Bug #21 Safari does not support promises yet.
                if (this._isSupportingPromises) {
                    // Bug #1: Chrome requires a successCallback.
                    if (successCallback === undefined) {
                        successCallback = () => {}; // tslint:disable-line:no-empty
                    }

                    return this._unpatchedOfflineAudioContext
                        .decodeAudioData(audioData, successCallback, (err) => {
                            if (typeof errorCallback === 'function') {
                                // Bug #7: Firefox calls the callback with undefined.
                                if (err === undefined) {
                                    errorCallback(encodingErrorFactory.create());
                                // Bug #27: Edge is rejecting invalid arrayBuffers with a DOMException.
                                } else if (err instanceof DOMException && err.name === 'NotSupportedError') {
                                    errorCallback(new TypeError());
                                } else {
                                    errorCallback(err);
                                }
                            }
                        })
                        .catch ((err) => {
                            // Bug #6: Chrome, Firefox and Opera do not call the errorCallback in case of an invalid buffer.
                            if (typeof errorCallback === 'function' && err instanceof TypeError) {
                                errorCallback(err);
                            }

                            // Bug #27: Edge is rejecting invalid arrayBuffers with a DOMException.
                            if (err instanceof DOMException && err.name === 'NotSupportedError') {
                                throw new TypeError();
                            }

                            throw err;
                        });
                }

                // Bug #21: Safari does not return a Promise yet.
                return new Promise((resolve, reject) => {
                    const fail = (err) => {
                        if (typeof errorCallback === 'function') {
                            errorCallback(err);
                        }

                        reject(err);
                    };

                    const succeed = (dBffrWrppr) => {
                        resolve(dBffrWrppr);

                        if (typeof successCallback === 'function') {
                            successCallback(dBffrWrppr);
                        }
                    };

                    // Bug #26: Safari throws a synchronous error.
                    try {
                        // Bug #1: Safari requires a successCallback.
                        this._unpatchedOfflineAudioContext.decodeAudioData(audioData, (audioBuffer) => {
                            // Bug #5: Safari does not support copyFromChannel() and copyToChannel().
                            if (typeof audioBuffer.copyFromChannel !== 'function') {
                                audioBufferWrapper.wrap(audioBuffer);
                            // Bug #42: Firefox does not yet fully support copyFromChannel() and copyToChannel().
                            } else if (!this._isSupportingCopyChannelMethods) {
                                audioBufferCopyChannelMethodsWrapper.wrap(audioBuffer);
                            }

                            succeed(audioBuffer);
                        }, (err) => {
                            // Bug #4: Safari returns null instead of an error.
                            if (err === null) {
                                fail(encodingErrorFactory.create());
                            } else {
                                fail(err);
                            }
                        });
                    } catch (err) {
                        fail(err);
                    }
                });
            }

            // @todo public resume () {
            // @todo     return this._unpatchedOfflineAudioContext.resume();
            // @todo }

            public startRendering () {
                return this._destination
                    .render(this._unpatchedOfflineAudioContext)
                    .then(() => {
                        // Bug #21 Safari does not support promises yet.
                        if (this._isSupportingPromises) {
                            return this._unpatchedOfflineAudioContext.startRendering();
                        }

                        return new Promise((resolve) => {
                            this._unpatchedOfflineAudioContext.oncomplete = (event) => resolve(event.renderedBuffer);

                            this._unpatchedOfflineAudioContext.startRendering();
                        });
                    });
            }

            // @todo public suspend (suspendTime) {
            // @todo     return this._unpatchedOfflineAudioContext.suspend(suspendTime);
            // @todo }

        }

        return OfflineAudioContext;
    }
};
