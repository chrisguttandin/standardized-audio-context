'use strict';

import { Inject } from 'angular2/core';
import { unpatchedAudioContextConstructor } from './unpatched-audio-context-constructor';

var pool = [];

function createEncodingError () {
    var exception;

    try {
        exception = new DOMException('', 'EncodingError');
    } catch (err) {
        exception = new Error();

        exception.code = 0;
        exception.name = 'EncodingError';
    }

    return exception;
}

function createInvalidStateError () {
    var exception;

    try {
        exception = new DOMException('', 'InvalidStateError');
    } catch (err) {
        exception = new Error();

        exception.code = 11;
        exception.name = 'InvalidStateError';
    }

    return exception;
}

function createNotSupportedError () {
    var exception;

    try {
        exception = new DOMException('', 'NotSupportedError');
    } catch (err) {
        exception = new Error();

        exception.code = 9;
        exception.name = 'NotSupportedError';
    }

    return exception;
}

function testForChainingSupport (audioContext) {
    var destination = audioContext.createGain(),
        isSupportingChaining,
        target = audioContext.createGain();

    isSupportingChaining = (target.connect(destination) === destination);

    target.disconnect(destination);

    return isSupportingChaining;
}

function testForDisconnectingSupport (audioContext, callback) {
    var analyzer,
        channelData,
        dummy,
        ones,
        source;

    analyzer = audioContext.createScriptProcessor(256, 1, 1);
    dummy = audioContext.createGain();

    // Safari does not loop buffers which contain just one frame.
    ones = audioContext.createBuffer(1, 2, 44100);
    channelData = ones.getChannelData(0);
    channelData[0] = 1;
    channelData[1] = 1;

    source = audioContext.createBufferSource();
    source.buffer = ones;
    source.loop = true;

    source.connect(analyzer);
    analyzer.connect(audioContext.destination);
    source.connect(dummy);
    source.disconnect(dummy);

    analyzer.onaudioprocess = function (event) {
        var channelData = event.inputBuffer.getChannelData(0);

        if (Array.prototype.some.call(channelData, (sample) => sample === 1)) {
            callback(true);
        } else {
            callback(false);
        }

        source.stop();

        analyzer.onaudioprocess = null;

        source.disconnect(analyzer);
        analyzer.disconnect(audioContext.destination);
    };

    source.start();
}

function testForPromiseSupport (audioContext) {
    // This 12 numbers represent the 48 bytes of an empty WAVE file with a single sample.
    /* eslint-disable indent */
    var uint32Array = new Uint32Array([
            1179011410,
            40,
            1163280727,
            544501094,
            16,
            131073,
            44100,
            176400,
            1048580,
            1635017060,
            4,
            0
        ]);
    /* eslint-enable indent */

    try {
        let promise = audioContext.decodeAudioData(uint32Array.buffer, function () {
            // ignore success callback
        }, function () {
            // ignore error callback
        });

        if (promise === undefined) {
            return false;
        }

        promise.catch(function () {
            // ignore rejected errors
        });

        return true;
    } catch (err) {
        // ignore thrown errors
    }

    return false;
}

function wrapAudioBuffer (audioBuffer) {
    // @todo throw errors
    audioBuffer.copyFromChannel = function (destination, channelNumber, startInChannel) {
        var channelData,
            channelLength,
            destinationLength,
            i;

        if (arguments.length < 3) {
            startInChannel = 0;
        }

        channelData = audioBuffer.getChannelData(channelNumber);
        channelLength = channelData.length;
        destinationLength = destination.length;

        for (i = 0; i + startInChannel < channelLength && i < destinationLength; i += 1) {
            destination[i] = channelData[i + startInChannel];
        }
    };

    audioBuffer.copyToChannel = function (source, channelNumber, startInChannel) {
        var channelData,
            channelLength,
            i,
            sourceLength;

        if (arguments.length < 3) {
            startInChannel = 0;
        }

        channelData = audioBuffer.getChannelData(channelNumber);
        channelLength = channelData.length;
        sourceLength = source.length;

        for (i = 0; i + startInChannel < channelLength && i < sourceLength; i += 1) {
            channelData[i + startInChannel] = source[i];
        }
    };

    return audioBuffer;
}

function wrapAudioNodesConnectMethod (audioNode) {
    audioNode.connect = (function (connect) {
        return function (destination) {
            connect.apply(audioNode, arguments);

            return destination;
        };
    }(audioNode.connect));

    return audioNode;
}

function wrapAudioNodesDisconnectMethod (audioNode) {
    var destinations = new Map();

    audioNode.connect = (function (connect) {
        return function (destination, output = 0, input = 0) {
            destinations.set(destination, {
                input,
                output
            });

            return connect.call(audioNode, destination, output, input);
        };
    }(audioNode.connect));

    audioNode.disconnect = (function (disconnect) {
        return function (destination) {
            disconnect.apply(audioNode);

            if (arguments.length > 0 && destinations.has(destination)) {
                destinations.delete(destination);

                destinations.forEach(function (value, destination) {
                    audioNode.connect(destination, value.input, value.output);
                });
            }
        };
    }(audioNode.disconnect));

    return audioNode;
}

function wrapChannelMergerNode (channelMergerNode) {
    Object.defineProperty(channelMergerNode, 'channelCount', {
        get: function () {
            return 1;
        },
        set: function () {
            throw createInvalidStateError();
        }
    });

    Object.defineProperty(channelMergerNode, 'channelCountMode', {
        get: function () {
            return 'explicit';
        },
        set: function () {
            throw createInvalidStateError();
        }
    });

    return channelMergerNode;
}

export function audioContextConstructor (unpatchedAudioContextConstructor) {

    return class AudioContext {

        constructor () {
            /* eslint-disable new-cap */
            var unpatchedAudioContext = (pool.length > 0) ?
                    pool.shift() : new unpatchedAudioContextConstructor();
            /* eslint-enable new-cap */

            this._isSupportingChaining = testForChainingSupport(unpatchedAudioContext);
            this._isSupportingDisconnecting = false;
            testForDisconnectingSupport(unpatchedAudioContext, (isSupportingDisconnecting) => this._isSupportingDisconnecting = isSupportingDisconnecting);
            this._isSupportingPromises = testForPromiseSupport(unpatchedAudioContext);
            this._onStateChangeListener = null;
            this._unpatchedAudioContext = unpatchedAudioContext;
            this._state = (unpatchedAudioContext.state === undefined) ? 'suspended' : null;

            // If the unpatched AudioContext does not expose its state, it gets faked by
            // transitioning it to running after 100 milliseconds.
            if (unpatchedAudioContext.state === undefined) {
                setTimeout(() => {
                    if (this._state === 'suspended') {
                        this._state = 'running';

                        if (this._onStateChangeListener !== null) {
                            this._onStateChangeListener();
                        }

                        // Kick of the AudioContext.
                        unpatchedAudioContext.createBufferSource();
                    }
                }, 100);
            }

            // Chrome and Opera pretend to be running right away, but fire a onstatechange event
            // when their state actually changes to 'running'.
            if (unpatchedAudioContext.state === 'running') {
                let onchange,
                    revokeState;

                this._state = 'suspended';

                revokeState = () => {
                    if (this._state === 'suspended') {
                        this._state = null;
                    }

                    // Safari's AudioContext does not implement the EventTarget interface
                    if (unpatchedAudioContext.removeEventListener) {
                        unpatchedAudioContext.removeEventListener('statechange', revokeState);
                    } else {
                        unpatchedAudioContext.onchange = onchange;
                    }
                };

                // Safari's AudioContext does not implement the EventTarget interface
                if (unpatchedAudioContext.addEventListener) {
                    unpatchedAudioContext.addEventListener('statechange', revokeState);
                } else {
                    onchange = unpatchedAudioContext.onchange;

                    if (onchange === null) {
                        unpatchedAudioContext.onchange = revokeState;
                    } else {
                        unpatchedAudioContext.onchange = function (event) {
                            revokeState();
                            onchange(event);
                        };
                    }
                }
            }
        }

        get currentTime () {
            return this._unpatchedAudioContext.currentTime;
        }

        set currentTime (value) {
            this._unpatchedAudioContext.currentTime = value;

            // If the unpatched AudioContext does not throw an error by itself, it has to be faked.
            throw new TypeError();
        }

        get destination () {
            return this._unpatchedAudioContext.destination;
        }

        set destination (value) {
            this._unpatchedAudioContext.destination = value;

            // If the unpatched AudioContext does not throw an error by itself, it has to be faked.
            throw new TypeError();
        }

        get onstatechange () {
            if ('onstatechange' in this._unpatchedAudioContext) {
                return this._unpatchedAudioContext.onstatechange;
            }

            return this._onStateChangeListener;
        }

        set onstatechange (listener) {
            if ('onstatechange' in this._unpatchedAudioContext) {
                return (this._unpatchedAudioContext.onstatechange = listener);
            }

            this._onStateChangeListener = (typeof listener === 'function') ? listener : null;

            return listener;
        }

        get sampleRate () {
            return this._unpatchedAudioContext.sampleRate;
        }

        set sampleRate (value) {
            this._unpatchedAudioContext.sampleRate = value;

            // If the unpatched AudioContext does not throw an error by itself, it has to be faked.
            throw new TypeError();
        }

        get state () {
            return (this._state !== null) ? this._state : this._unpatchedAudioContext.state;
        }

        set state (value) {
            if (this._unpatchedAudioContext.state !== undefined) {
                this._unpatchedAudioContext.state = value;
            }

            // If the unpatched AudioContext does not have a property called state or does not throw
            // an error by itself, it has to be faked.
            throw new TypeError();
        }

        close () {
            // If the unpatched AudioContext does not provide a close method and was closed before
            // it should throw an error.
            if (this._unpatchedAudioContext === null && this.state === 'closed') {
                return Promise.reject(createInvalidStateError());
            }

            // If the unpatched AudioContext does not provide a close method it should be imitated.
            if (this._unpatchedAudioContext.close === undefined) {
                pool.push(this._unpatchedAudioContext);

                this._unpatchedAudioContext = null;
                this._state = 'closed';

                return Promise.resolve();
            }

            // If the unpatched AudioContext does not throw an error if it was closed before, it has
            // to be faked.
            if (this.state === 'closed') {
                return this._unpatchedAudioContext
                    .close()
                    .then(() => {
                        throw createInvalidStateError();
                    });
            }

            // If the state was set to suspended before it should be revoked now.
            if (this._state === 'suspended') {
                this._state = null;
            }

            return this._unpatchedAudioContext.close();
        }

        createBiquadFilter () {
            var biquadFilterNode;

            if (this._state === 'suspended') {
                this._state = 'running';

                if (this._onStateChangeListener !== null) {
                    this._onStateChangeListener();
                }
            }

            if (this._unpatchedAudioContext === null) {
                throw createInvalidStateError();
            }

            biquadFilterNode = this._unpatchedAudioContext.createBiquadFilter();

            // If the unpatched AudioContext throws an error by itself, this code will never get
            // executed. If it does it will imitate the behaviour of throwing an error.
            if (this.state === 'closed') {
                throw createInvalidStateError();
            }

            // Only Chrome and Firefox support chaining in their dev versions yet.
            if (!this._isSupportingChaining) {
                biquadFilterNode = wrapAudioNodesConnectMethod(biquadFilterNode);
            }

            return biquadFilterNode;
        }

        createBuffer (numberOfChannels, length, sampleRate) {
            var audioBuffer;

            if (this._state === 'suspended') {
                this._state = 'running';

                if (this._onStateChangeListener !== null) {
                    this._onStateChangeListener();
                }
            }

            audioBuffer = this._unpatchedAudioContext.createBuffer(numberOfChannels, length, sampleRate);

            // Safari does not support copyFromChannel() and copyToChannel().
            if (typeof audioBuffer.copyFromChannel !== 'function') {
                audioBuffer = wrapAudioBuffer(audioBuffer);
            }

            return audioBuffer;
        }

        createBufferSource () {
            var audioBufferSourceNode;

            if (this._state === 'suspended') {
                this._state = 'running';

                if (this._onStateChangeListener !== null) {
                    this._onStateChangeListener();
                }
            }

            audioBufferSourceNode = this._unpatchedAudioContext.createBufferSource();

            // Only Chrome and Firefox support chaining in their dev versions yet.
            if (!this._isSupportingChaining) {
                audioBufferSourceNode = wrapAudioNodesConnectMethod(audioBufferSourceNode);
            }

            return audioBufferSourceNode;
        }

        createChannelMerger (/* numberOfInputs */) {
            var channelMergerNode;

            if (this._state === 'suspended') {
                this._state = 'running';

                if (this._onStateChangeListener !== null) {
                    this._onStateChangeListener();
                }
            }

            if (this._unpatchedAudioContext === null) {
                throw createInvalidStateError();
            }

            channelMergerNode = this._unpatchedAudioContext.createChannelMerger.apply(this._unpatchedAudioContext, arguments);

            // If the unpatched AudioContext throws an error by itself, this code will never get
            // executed. If it does it will imitate the behaviour of throwing an error.
            if (this.state === 'closed') {
                throw createInvalidStateError();
            }

            // Only Chrome and Firefox support chaining in their dev versions yet.
            if (!this._isSupportingChaining) {
                channelMergerNode = wrapAudioNodesConnectMethod(channelMergerNode);
            }

            // Firefox and Safari do not return the default properties.
            if (channelMergerNode.channelCount === 2 &&
                    channelMergerNode.channelCountMode === 'max') {
                channelMergerNode = wrapChannelMergerNode(channelMergerNode);
            }

            return channelMergerNode;
        }

        createChannelSplitter (/* numberOfOutputs */) {
            var channelSplitterNode;

            if (this._state === 'suspended') {
                this._state = 'running';

                if (this._onStateChangeListener !== null) {
                    this._onStateChangeListener();
                }
            }

            if (this._unpatchedAudioContext === null) {
                throw createInvalidStateError();
            }

            channelSplitterNode = this._unpatchedAudioContext.createChannelSplitter.apply(this._unpatchedAudioContext, arguments);

            // If the unpatched AudioContext throws an error by itself, this code will never get
            // executed. If it does it will imitate the behaviour of throwing an error.
            if (this.state === 'closed') {
                throw createInvalidStateError();
            }

            // Only Chrome and Firefox support chaining in their dev versions yet.
            if (!this._isSupportingChaining) {
                channelSplitterNode = wrapAudioNodesConnectMethod(channelSplitterNode);
            }

            return channelSplitterNode;
        }

        createGain () {
            var gainNode;

            if (this._state === 'suspended') {
                this._state = 'running';

                if (this._onStateChangeListener !== null) {
                    this._onStateChangeListener();
                }
            }

            if (this._unpatchedAudioContext === null) {
                throw createInvalidStateError();
            }

            gainNode = this._unpatchedAudioContext.createGain();

            // If the unpatched AudioContext throws an error by itself, this code will never get
            // executed. If it does it will imitate the behaviour of throwing an error.
            if (this.state === 'closed') {
                throw createInvalidStateError();
            }

            // Only Chrome and Firefox support chaining in their dev versions yet.
            if (!this._isSupportingChaining) {
                gainNode = wrapAudioNodesConnectMethod(gainNode);
            }

            // Only Chrome and Opera support disconnecting of a specific destination.
            if (!this._isSupportingDisconnecting) {
                gainNode = wrapAudioNodesDisconnectMethod(gainNode);
            }

            return gainNode;
        }

        createOscillator () {
            var oscillatorNode;

            if (this._state === 'suspended') {
                this._state = 'running';

                if (this._onStateChangeListener !== null) {
                    this._onStateChangeListener();
                }
            }

            if (this._unpatchedAudioContext === null) {
                throw createInvalidStateError();
            }

            oscillatorNode = this._unpatchedAudioContext.createOscillator();

            // If the unpatched AudioContext throws an error by itself, this code will never get
            // executed. If it does it will imitate the behaviour of throwing an error.
            if (this.state === 'closed') {
                throw createInvalidStateError();
            }

            // Only Chrome and Firefox support chaining in their dev versions yet.
            if (!this._isSupportingChaining) {
                oscillatorNode = wrapAudioNodesConnectMethod(oscillatorNode);
            }

            return oscillatorNode;
        }

        decodeAudioData (audioData) {
            if (this._state === 'suspended') {
                this._state = 'running';

                if (this._onStateChangeListener !== null) {
                    this._onStateChangeListener();
                }
            }

            if (this._isSupportingPromises) {
                return this._unpatchedAudioContext
                    .decodeAudioData(audioData)
                    // Firefox throws a TypeError instead of a NotSupportedError.
                    .catch(function (err) {
                        if (err.name === 'TypeError') {
                            throw createNotSupportedError();
                        }

                        throw err;
                    });
            }

            // Chrome crashes when asked to decode an AIFF file.
            if (audioData) {
                let array,
                    chunkId;

                array = new Uint8Array(audioData);
                chunkId = String.fromCharCode(array[0]) + String.fromCharCode(array[1]) + String.fromCharCode(array[2]) + String.fromCharCode(array[3]);

                if (chunkId === 'FORM') {
                    return Promise.reject(createEncodingError());
                }
            }

            return new Promise ((resolve, reject) => {
                try {
                    this._unpatchedAudioContext.decodeAudioData(audioData, function (audioBuffer) {
                        // Safari does not support copyFromChannel() and copyToChannel().
                        if (typeof audioBuffer.copyFromChannel !== 'function') {
                            audioBuffer = wrapAudioBuffer(audioBuffer);
                        }

                        resolve(audioBuffer);
                    }, function (err) {
                        // Opera returns null when asked to decode an MP3 file.
                        if (err === null) {
                            reject(createEncodingError());
                        } else {
                            reject(err);
                        }
                    });
                } catch (err) {
                    // Chrome, Opera and Safari do throw a SyntaxError instead of calling the errorCallback.
                    reject(createNotSupportedError());
                }
            });
        }

    };

}

audioContextConstructor.parameters = [ [ new Inject(unpatchedAudioContextConstructor) ] ];
