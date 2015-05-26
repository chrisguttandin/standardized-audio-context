'use strict';

var di = require('di'),
    pool = [],
    unpatchedAudioContextProvider = require('./unpatched-audio-context.js').provider;

function createInvalidStateError () {
    var err = new Error();

    err.code = 11;
    err.name = 'InvalidStateError';

    return err;
}

function testForPromiseSupport (audioContext) {
    try {
        return (audioContext.decodeAudioData(new ArrayBuffer(0), function () {}) !== undefined);
    } catch (err) {}

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

        get destination () {
            return this._unpatchedAudioContext.destination;
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

        get state () {
            return (this._state !== null) ? this._state : this._unpatchedAudioContext.state;
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
            return this._unpatchedAudioContext.createBiquadFilter();
        }

        createBuffer (numberOfChannels, length, sampleRate) {
            return this._unpatchedAudioContext.createBuffer(numberOfChannels, length, sampleRate);
        }

        createChannelMerger (numberOfInputs) {
            var channelMergerNode = this._unpatchedAudioContext.createChannelMerger(numberOfInputs);

            if (channelMergerNode.channelCount === 2 &&
                    channelMergerNode.channelCountMode === 'max') {
                channelMergerNode = wrapChannelMergerNode(channelMergerNode);
            }

            return channelMergerNode;
        }

        createChannelSplitter (numberOfOutputs) {
            return this._unpatchedAudioContext.createChannelSplitter(numberOfOutputs);
        }

        createGain () {
            return this._unpatchedAudioContext.createGain();
        }

        decodeAudioData (audioData) {
            if (this._isSupportingPromises) {
                return this._unpatchedAudioContext.decodeAudioData(audioData);
            }

            return new Promise ((resolve, reject) => {
                this._unpatchedAudioContext.decodeAudioData(audioData, function (audioBuffer) {
                    resolve(audioBuffer);
                }, reject);
            });
        }

    };

}

di.annotate(provider, new di.Inject(unpatchedAudioContextProvider));

module.exports.provider = provider;
