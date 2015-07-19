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

function testForPromiseSupport (audioContext) {
    try {
        let promise = audioContext.decodeAudioData(new ArrayBuffer(0), function () {});

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

function wrapChannelMergerNode (channelMergerNode) {
    return Object.create(channelMergerNode, {
        channelCount: {
            get: function () {
                return 1;
            }
        },
        channelCountMode: {
            get: function () {
                return 'explicit';
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

            // If the unpatched AudioContext does pretend to be running right away, it gets
            // prevented from doing so.
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
            return this._unpatchedAudioContext.createBuffer(numberOfChannels, length, sampleRate);
        }

        createBufferSource () {
            return this._unpatchedAudioContext.createBufferSource();
        }

        createChannelMerger (numberOfInputs) {
            var channelMergerNode;

            if (this._unpatchedAudioContext === null) {
                throw createInvalidStateError();
            }

            channelMergerNode = this._unpatchedAudioContext.createChannelMerger(numberOfInputs);

            // If the unpatched AudioContext throws an error by itself, this code will never get
            // executed. If it does it will imitate the behaviour of throwing an error.
            if (this.state === 'closed') {
                throw createInvalidStateError();
            }

            if (channelMergerNode.channelCount === 2 &&
                    channelMergerNode.channelCountMode === 'max') {
                channelMergerNode = wrapChannelMergerNode(channelMergerNode);
            }

            return channelMergerNode;
        }

        createChannelSplitter (numberOfOutputs) {
            var channelSplitterNode;

            if (this._unpatchedAudioContext === null) {
                throw createInvalidStateError();
            }

            channelSplitterNode = this._unpatchedAudioContext.createChannelSplitter(numberOfOutputs);

            // If the unpatched AudioContext throws an error by itself, this code will never get
            // executed. If it does it will imitate the behaviour of throwing an error.
            if (this.state === 'closed') {
                throw createInvalidStateError();
            }

            return channelSplitterNode;
        }

        createGain () {
            var gainNode;

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

        decodeAudioData (audioData) {
            if (this._isSupportingPromises) {
                return this._unpatchedAudioContext.decodeAudioData(audioData);
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
                this._unpatchedAudioContext.decodeAudioData(audioData, resolve, function (err) {
                    // Opera returns null when asked to decode an MP3 file.
                    if (err === null) {
                        reject(createEncodingError());
                    } else {
                        reject(err);
                    }
                });
            });
        }

    };

}

di.annotate(provider, new di.Inject(unpatchedAudioContextProvider));

module.exports.provider = provider;
