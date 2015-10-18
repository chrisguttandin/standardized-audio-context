'use strict';

var di = require('di'),
    pool = [],
    unpatchedAudioContextProvider = require('./unpatched-audio-context.js').provider;

function createEncodingError () {
    var err = new Error();

    err.code = 0;
    err.name = 'EncodingError';

    return err;
}

function createInvalidStateError () {
    var err = new Error();

    err.code = 11;
    err.name = 'InvalidStateError';

    return err;
}

function createNotSupportedError () {
    var err = new Error();

    err.code = 9;
    err.name = 'NotSupportedError';

    return err;
}

function testForPromiseSupport (audioContext) {
    // This 12 numbers represent the 48 bytes of an empty WAVE file with a single sample.
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

function wrapChannelMergerNode (channelMergerNode) {
    return Object.create(channelMergerNode, {
        channelCount: {
            get: function () {
                return 1;
            },
            set: function () {
                throw createInvalidStateError();
            }
        },
        channelCountMode: {
            get: function () {
                return 'explicit';
            },
            set: function () {
                throw createInvalidStateError();
            }
        },
        channelInterpretation: {
            get: function () {
                return channelMergerNode.channelInterpretation;
            }
        },
        numberOfInputs: {
            get: function () {
                return channelMergerNode.numberOfInputs;
            }
        },
        numberOfOutputs: {
            get: function () {
                return channelMergerNode.numberOfOutputs;
            }
        }
    });
}

function provider (UnpatchedAudioContext) {

    return class AudioContext {

        constructor () {
            var unpatchedAudioContext = (pool.length > 0) ?
                    pool.shift() : new UnpatchedAudioContext();

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
                let revokeState;

                this._state = 'suspended';

                revokeState = () => {
                    if (this._state === 'suspended') {
                        this._state = null;
                    }

                    unpatchedAudioContext.removeEventListener('statechange', revokeState);
                };

                unpatchedAudioContext.addEventListener('statechange', revokeState);
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
            if (this._state === 'suspended') {
                this._state = 'running';

                if (this._onStateChangeListener !== null) {
                    this._onStateChangeListener();
                }
            }

            return this._unpatchedAudioContext.createBufferSource();
        }

        createChannelMerger (numberOfInputs) {
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

            // Firefox and Safari do not return the default properties.
            if (channelMergerNode.channelCount === 2 &&
                    channelMergerNode.channelCountMode === 'max') {
                channelMergerNode = wrapChannelMergerNode(channelMergerNode);
            }

            return channelMergerNode;
        }

        createChannelSplitter (numberOfOutputs) {
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

di.annotate(provider, new di.Inject(unpatchedAudioContextProvider));

module.exports.provider = provider;
