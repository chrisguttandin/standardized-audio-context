import { AudioBufferWrapper } from './wrapper/audio-buffer';
import { AudioNodeConnectMethodWrapper } from './wrapper/audio-node-connect-method';
import { AudioNodeDisconnectMethodWrapper } from './wrapper/audio-node-disconnect-method';
import { ChainingSupportTester } from './tester/chaining-support';
import { EncodingErrorFactory } from './factories/encoding-error';
import { Inject } from 'angular2/core';
import { NotSupportedErrorFactory } from './factories/not-supported-error';
import { PromiseSupportTester } from './tester/promise-support';
import { unpatchedOfflineAudioContextConstructor } from './unpatched-offline-audio-context-constructor';

function testForDisconnectingSupport (offlineAudioContext, callback) {
    var channelData,
        dummy,
        ones,
        source;

    dummy = offlineAudioContext.createGain();

    // Safari does not play buffers which contain just one frame.
    ones = offlineAudioContext.createBuffer(1, 2, 44100);
    channelData = ones.getChannelData(0);
    channelData[0] = 1;
    channelData[1] = 1;

    source = offlineAudioContext.createBufferSource();
    source.buffer = ones;
    source.loop = true;

    source.connect(offlineAudioContext.destination);
    source.connect(dummy);
    source.disconnect(dummy);

    source.start();

    offlineAudioContext.oncomplete = (event) => {
        var channelData = event.renderedBuffer.getChannelData(0);

        if (channelData[0] === 1) {
            callback(true);
        } else {
            callback(false);
        }

        source.disconnect(offlineAudioContext.destination);
    };
    offlineAudioContext.startRendering();
}

export function offlineAudioContextConstructor (audioBufferWrapper, audioNodeConnectMethodWrapper, audioNodeDisconnectMethodWrapper, chainingSupportTester, encodingErrorFactory, notSupportedErrorFactory, promiseSupportTester, unpatchedOfflineAudioContextConstructor) {
    return class OfflineAudioContext {

        constructor (numberOfChannels, length, sampleRate) {
            /* eslint-disable new-cap */
            var unpatchedOfflineAudioContext = new unpatchedOfflineAudioContextConstructor(numberOfChannels, length, sampleRate);
            /* eslint-enable new-cap */

            this._isSupportingChaining = chainingSupportTester.test(unpatchedOfflineAudioContext);
            this._isSupportingDisconnecting = false;
            testForDisconnectingSupport(unpatchedOfflineAudioContext, (isSupportingDisconnecting) => this._isSupportingDisconnecting = isSupportingDisconnecting);
            this._isSupportingPromises = promiseSupportTester.test(unpatchedOfflineAudioContext);
            this._unpatchedOfflineAudioContext = unpatchedOfflineAudioContext;
        }

        get destination () {
            return this._unpatchedOfflineAudioContext.destination;
        }

        get sampleRate () {
            return this._unpatchedOfflineAudioContext.sampleRate;
        }

        createGain () {
            var gainNode = this._unpatchedOfflineAudioContext.createGain();

            // bug #11: Edge and Safari do not support chaining yet.
            if (!this._isSupportingChaining) {
                gainNode = audioNodeConnectMethodWrapper.wrap(gainNode);
            }

            // bug #12: Firefox and Safari do not support to disconnect a specific destination.
            if (!this._isSupportingDisconnecting) {
                gainNode = audioNodeDisconnectMethodWrapper.wrap(gainNode);
            }

            return gainNode;
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

offlineAudioContextConstructor.parameters = [ [ new Inject(AudioBufferWrapper) ], [ new Inject(AudioNodeConnectMethodWrapper) ], [ new Inject(AudioNodeDisconnectMethodWrapper) ], [ new Inject(ChainingSupportTester) ], [ new Inject(EncodingErrorFactory) ], [ new Inject(NotSupportedErrorFactory) ], [ new Inject(PromiseSupportTester) ], [ new Inject(unpatchedOfflineAudioContextConstructor) ] ];
