import { AudioBufferWrapper } from './wrapper/audio-buffer';
import { AudioNodeConnectMethodWrapper } from './wrapper/audio-node-connect-method';
import { AudioNodeDisconnectMethodWrapper } from './wrapper/audio-node-disconnect-method';
import { ChainingSupportTester } from './tester/chaining-support';
import { DisconnectingSupportTester } from './tester/disconnecting-support';
import { EncodingErrorFactory } from './factories/encoding-error';
import { IIRFilterNodeGetFrequencyResponseMethodWrapper } from './wrapper/iir-filter-node-get-frequency-response-method';
import { Inject } from '@angular/core';
import { NotSupportedErrorFactory } from './factories/not-supported-error';
import { OfflineAudioBufferSourceNodeFakerFactory } from './factories/offline-audio-buffer-source-node';
import { OfflineAudioDestinationNodeFakerFactory } from './factories/offline-audio-destination-node';
import { OfflineBiquadFilterNodeFakerFactory } from './factories/offline-biquad-filter-node';
import { OfflineGainNodeFakerFactory } from './factories/offline-gain-node';
import { OfflineIIRFilterNodeFakerFactory } from './factories/offline-iir-filter-node';
import { PromiseSupportTester } from './tester/promise-support';
import { unpatchedOfflineAudioContextConstructor } from './unpatched-offline-audio-context-constructor';

export function offlineAudioContextConstructor (audioBufferWrapper, audioNodeConnectMethodWrapper, audioNodeDisconnectMethodWrapper, chainingSupportTester, disconnectingSupportTester, encodingErrorFactory, iIRFilterNodeGetFrequencyResponseMethodWrapper, notSupportedErrorFactory, offlineAudioBufferSourceNodeFakerFactory, offlineAudioDestinationNodeFakerFactory, offlineBiquadFilterNodeFakerFactory, offlineGainNodeFakerFactory, offlineIIRFilterNodeFakerFactory, promiseSupportTester, unpatchedOfflineAudioContextConstructor) {
    return class OfflineAudioContext {

        constructor (numberOfChannels, length, sampleRate) {
            var fakeNodeStore = new WeakMap(),
                /* eslint-disable new-cap */
                unpatchedOfflineAudioContext = new unpatchedOfflineAudioContextConstructor(numberOfChannels, length, sampleRate);
                /* eslint-enable new-cap */

            this._destination = offlineAudioDestinationNodeFakerFactory.create({ fakeNodeStore });
            this._fakeNodeStore = fakeNodeStore;
            this._isSupportingChaining = chainingSupportTester.test(unpatchedOfflineAudioContext);
            this._isSupportingDisconnecting = false;
            disconnectingSupportTester.test((isSupportingDisconnecting) => this._isSupportingDisconnecting = isSupportingDisconnecting);
            this._isSupportingGetFrequencyResponseErrors = false;
            this._isSupportingPromises = promiseSupportTester.test(unpatchedOfflineAudioContext);
            this._length = length;
            this._numberOfChannels = numberOfChannels;
            this._unpatchedOfflineAudioContext = unpatchedOfflineAudioContext;
        }

        // get currentTime () {
        //     return this._unpatchedOfflineAudioContext.currentTime;
        // }

        get destination () {
            return this._destination.proxy;
        }

        get length () {
            // bug #17: Only Chrome and Opera do expose the length up to now.
            if (this._unpatchedOfflineAudioContext.length === undefined) {
                return this._length;
            }

            return this._unpatchedOfflineAudioContext.length;
        }

        get sampleRate () {
            return this._unpatchedOfflineAudioContext.sampleRate;
        }

        createBiquadFilter () {
            return offlineBiquadFilterNodeFakerFactory.create({
                fakeNodeStore: this._fakeNodeStore,
                nativeNode: this._unpatchedOfflineAudioContext.createBiquadFilter()
            }).proxy;
        }

        createBuffer (numberOfChannels, length, sampleRate) {
            // @todo Consider browsers which do not fully support this method yet.
            return this._unpatchedOfflineAudioContext.createBuffer(numberOfChannels, length, sampleRate);
        }

        createBufferSource () {
            return offlineAudioBufferSourceNodeFakerFactory.create({
                fakeNodeStore: this._fakeNodeStore
            }).proxy;
        }

        createGain () {
            return offlineGainNodeFakerFactory.create({
                fakeNodeStore: this._fakeNodeStore
            }).proxy;
        }

        createIIRFilter (feedforward, feedback) {
            var nativeNode = null;

            // bug #9: Only Chrome and Opera currently implement the createIIRFilter() method.
            if (this._unpatchedOfflineAudioContext.createIIRFilter !== undefined) {
                nativeNode = this._unpatchedOfflineAudioContext.createIIRFilter(feedforward, feedback);

                // bug 23 & 24: FirefoxDeveloper does not throw NotSupportedErrors anymore.
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

        decodeAudioData (audioData, successCallback, errorCallback) {
            // bug #21 Safari does not support promises yet.
            if (this._isSupportingPromises) {
                return this._unpatchedOfflineAudioContext
                    .decodeAudioData(audioData, successCallback, function (err) {
                        if (typeof errorCallback === 'function') {
                            // bug #7: Firefox calls the callback with undefined.
                            if (err === undefined) {
                                errorCallback(encodingErrorFactory.create());
                            // bug #27: Edge is rejecting invalid arrayBuffers with a DOMException.
                            } else if (err instanceof DOMException && err.name === 'NotSupportedError') {
                                errorCallback(new TypeError());
                            } else {
                                errorCallback(err);
                            }
                        }
                    })
                    .catch(function (err) {
                        // bug #6: Chrome, Firefox and Opera do not call the errorCallback in case
                        // of an invalid buffer.
                        if (typeof errorCallback === 'function' && err instanceof TypeError) {
                            errorCallback(err);
                        }

                        // bug #27: Edge is rejecting invalid arrayBuffers with a DOMException.
                        if (err instanceof DOMException && err.name === 'NotSupportedError') {
                            throw new TypeError();
                        }

                        throw err;
                    });
            }

            // bug #21: Safari does not return a Promise yet.
            return new Promise((resolve, reject) => {

                function fail (err) {
                    if (typeof errorCallback === 'function') {
                        errorCallback(err);
                    }

                    reject(err);
                }

                function succeed (audioBufferWrapper) {
                    resolve(audioBufferWrapper);

                    if (typeof successCallback === 'function') {
                        successCallback(audioBufferWrapper);
                    }
                }

                // bug #26: Safari throws a synchronous error.
                try {
                    // bug #1: Safari requires a successCallback.
                    this._unpatchedOfflineAudioContext.decodeAudioData(audioData, function (audioBuffer) {
                        // bug #5: Safari does not support copyFromChannel() and copyToChannel().
                        if (typeof audioBuffer.copyFromChannel !== 'function') {
                            succeed(audioBufferWrapper.wrap(audioBuffer));
                        } else {
                            succeed(audioBuffer);
                        }
                    }, function (err) {
                        // bug #4: Safari returns null instead of an error.
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

        // resume () {
        //     return this._unpatchedOfflineAudioContext.resume();
        // }

        startRendering () {
            return this._destination
                .render(this._unpatchedOfflineAudioContext)
                .then(() => {
                    // bug #21 Safari does not support promises yet.
                    if (this._isSupportingPromises) {
                        return this._unpatchedOfflineAudioContext.startRendering();
                    }

                    return new Promise((resolve) => {
                        this._unpatchedOfflineAudioContext.oncomplete = (event) => resolve(event.renderedBuffer);

                        this._unpatchedOfflineAudioContext.startRendering();
                    });
                });
        }

        // suspend (suspendTime) {
        //     return this._unpatchedOfflineAudioContext.suspend(suspendTime);
        // }

    };
}

offlineAudioContextConstructor.parameters = [ [ new Inject(AudioBufferWrapper) ], [ new Inject(AudioNodeConnectMethodWrapper) ], [ new Inject(AudioNodeDisconnectMethodWrapper) ], [ new Inject(ChainingSupportTester) ], [ new Inject(DisconnectingSupportTester) ], [ new Inject(EncodingErrorFactory) ], [ new Inject(IIRFilterNodeGetFrequencyResponseMethodWrapper) ], [ new Inject(NotSupportedErrorFactory) ], [ new Inject(OfflineAudioBufferSourceNodeFakerFactory) ], [ new Inject(OfflineAudioDestinationNodeFakerFactory) ], [ new Inject(OfflineBiquadFilterNodeFakerFactory) ], [ new Inject(OfflineGainNodeFakerFactory) ], [ new Inject(OfflineIIRFilterNodeFakerFactory) ], [ new Inject(PromiseSupportTester) ], [ new Inject(unpatchedOfflineAudioContextConstructor) ] ];
