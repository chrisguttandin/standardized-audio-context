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

        decodeAudioData (audioData) {
            if (this._isSupportingPromises) {
                return this._unpatchedOfflineAudioContext
                    .decodeAudioData(audioData)
                    // bug #3: Chrome and Firefox reject a TypeError.
                    .catch(function (err) {
                        if (err.name === 'TypeError') {
                            throw notSupportedErrorFactory.create();
                        }

                        throw err;
                    });
            }

            // bug #1: Chrome, Opera and Safari do not return a Promise yet.
            return new Promise ((resolve, reject) => {
                // bug #2: Chrome, Opera and Safari throw a wrong DOMException.
                try {
                    this._unpatchedOfflineAudioContext.decodeAudioData(audioData, function (audioBuffer) {
                        // bug #5: Safari does not support copyFromChannel() and copyToChannel().
                        if (typeof audioBuffer.copyFromChannel !== 'function') {
                            resolve(audioBufferWrapper.wrap(audioBuffer));
                        } else {
                            resolve(audioBuffer);
                        }
                    }, function (err) {
                        // bug #4: Chrome and Opera return null instead of an error.
                        if (err === null) {
                            reject(encodingErrorFactory.create());
                        } else {
                            reject(err);
                        }
                    });
                } catch (err) {
                    reject(notSupportedErrorFactory.create());
                }
            });
        }

    };

}

offlineAudioContextConstructor.parameters = [ [ new Inject(AudioBufferWrapper) ], [ new Inject(EncodingErrorFactory) ], [ new Inject(NotSupportedErrorFactory) ], [ new Inject(PromiseSupportTester) ], [ new Inject(unpatchedOfflineAudioContextConstructor) ] ];
