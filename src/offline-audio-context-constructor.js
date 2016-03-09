import { AudioBufferWrapper } from './wrapper/audio-buffer';
import { EncodingErrorFactory } from './factories/encoding-error';
import { Inject } from 'angular2/core';
import { NotSupportedErrorFactory } from './factories/not-supported-error';
import { PromiseSupportTester } from './tester/promise-support';
import { unpatchedOfflineAudioContextConstructor } from './unpatched-offline-audio-context-constructor';

export function offlineAudioContextConstructor (audioBufferWrapper, encodingErrorFactory, notSupportedErrorFactory, promiseSupportTester, unpatchedOfflineAudioContextConstructor) {

    return class OfflineAudioContext {

        constructor (numberOfChannels, length, sampleRate) {
            /* eslint-disable new-cap */
            var unpatchedOfflineAudioContext = new unpatchedOfflineAudioContextConstructor(numberOfChannels, length, sampleRate);
            /* eslint-enable new-cap */

            this._isSupportingPromises = promiseSupportTester.test(unpatchedOfflineAudioContext);
            this._unpatchedOfflineAudioContext = unpatchedOfflineAudioContext;
        }

        decodeAudioData (audioData, successCallback, errorCallback) {
            if (this._isSupportingPromises) {
                return this._unpatchedOfflineAudioContext
                    .decodeAudioData(audioData, successCallback, function (err) {
                        if (typeof errorCallback === 'function') {
                            // bug #7: Firefox calls the callback with undefined.
                            if (err === undefined) {
                                errorCallback(encodingErrorFactory.create());
                            } else {
                                errorCallback(err);
                            }
                        }
                    })
                    // bug #3: Chrome and Firefox reject a TypeError.
                    .catch(function (err) {
                        if (err.name === 'TypeError') {
                            err = notSupportedErrorFactory.create();

                            // bug #6: Chrome and Firefox do not call the errorCallback in case of an invalid buffer.
                            if (typeof errorCallback === 'function') {
                                errorCallback(err);
                            }

                            throw err;
                        }

                        throw err;
                    });
            }

            // bug #1: Opera and Safari do not return a Promise yet.
            return new Promise ((resolve, reject) => {

                function fail (err) {
                    reject(err);

                    if (typeof errorCallback === 'function') {
                        errorCallback(err);
                    }
                }

                function succeed (audioBufferWrapper) {
                    resolve(audioBufferWrapper);

                    if (typeof successCallback === 'function') {
                        successCallback(audioBufferWrapper);
                    }
                }

                // bug #2: Opera and Safari throw a wrong DOMException.
                try {
                    this._unpatchedOfflineAudioContext.decodeAudioData(audioData, function (audioBuffer) {
                        // bug #5: Safari does not support copyFromChannel() and copyToChannel().
                        if (typeof audioBuffer.copyFromChannel !== 'function') {
                            succeed(audioBufferWrapper.wrap(audioBuffer));
                        } else {
                            succeed(audioBuffer);
                        }
                    }, function (err) {
                        // bug #4: Opera returns null instead of an error.
                        if (err === null) {
                            fail(encodingErrorFactory.create());
                        } else {
                            fail(err);
                        }
                    });
                } catch (err) {
                    fail(notSupportedErrorFactory.create());
                }
            });
        }

    };

}

offlineAudioContextConstructor.parameters = [ [ new Inject(AudioBufferWrapper) ], [ new Inject(EncodingErrorFactory) ], [ new Inject(NotSupportedErrorFactory) ], [ new Inject(PromiseSupportTester) ], [ new Inject(unpatchedOfflineAudioContextConstructor) ] ];
