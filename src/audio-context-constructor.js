import { AudioBufferSourceNodeStopMethodWrapper } from './wrapper/audio-buffer-source-node-stop-method';
import { AudioBufferWrapper } from './wrapper/audio-buffer';
import { AudioNodeConnectMethodWrapper } from './wrapper/audio-node-connect-method';
import { AudioNodeDisconnectMethodWrapper } from './wrapper/audio-node-disconnect-method';
import { ChainingSupportTester } from './tester/chaining-support';
import { ChannelMergerNodeWrapper } from './wrapper/channel-merger-node';
import { ChannelSplitterNodeWrapper } from './wrapper/channel-splitter-node';
import { EncodingErrorFactory } from './factories/encoding-error';
import { IIRFilterNodeFaker } from './fakers/iir-filter-node';
import { IIRFilterNodeGetFrequencyResponseMethodWrapper } from './wrapper/iir-filter-node-get-frequency-response-method';
import { Inject } from '@angular/core';
import { InvalidStateErrorFactory } from './factories/invalid-state-error';
import { NotSupportedErrorFactory } from './factories/not-supported-error';
import { PromiseSupportTester } from './tester/promise-support';
import { StopStoppedSupportTester } from './tester/stop-stopped-support';
import { unpatchedAudioContextConstructor } from './unpatched-audio-context-constructor';

var pool = [];

function testForDisconnectingSupport (audioContext, callback) {
    var analyzer,
        channelData,
        dummy,
        ones,
        source;

    analyzer = audioContext.createScriptProcessor(256, 1, 1);
    dummy = audioContext.createGain();

    // Safari does not play buffers which contain just one frame.
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

function wrapAnalyserNode (analyserNode) {
    analyserNode.getFloatTimeDomainData = function (array) {
        var byteTimeDomainData = new Uint8Array(array.length);

        analyserNode.getByteTimeDomainData(byteTimeDomainData);

        for (let i = 0, length = Math.max(byteTimeDomainData.length, analyserNode.fftSize); i < length; i += 1) {
            array[i] = (byteTimeDomainData[i] - 128) * 0.0078125;
        }

        return array;
    };

    return analyserNode;
}

export function audioContextConstructor (audioBufferSourceNodeStopMethodWrapper, audioBufferWrapper, audioNodeConnectMethodWrapper, audioNodeDisconnectMethodWrapper, chainingSupportTester, channelMergerNodeWrapper, channelSplitterNodeWrapper, encodingErrorFactory, invalidStateErrorFactory, iIRFilterNodeFaker, iIRFilterNodeGetFrequencyResponseMethodWrapper, notSupportedErrorFactory, promiseSupportTester, stopStoppedSupportTester, unpatchedAudioContextConstructor) {
    return class AudioContext {

        constructor () {
            /* eslint-disable new-cap */
            var unpatchedAudioContext = (pool.length > 0) ?
                    pool.shift() : new unpatchedAudioContextConstructor();
            /* eslint-enable new-cap */

            this._isSupportingChaining = chainingSupportTester.test(unpatchedAudioContext);
            this._isSupportingDisconnecting = false;
            testForDisconnectingSupport(unpatchedAudioContext, (isSupportingDisconnecting) => this._isSupportingDisconnecting = isSupportingDisconnecting);
            this._isSupportingGetFrequencyResponseErrors = false;
            this._isSupportingPromises = promiseSupportTester.test(unpatchedAudioContext);
            this._isSupportingStoppingOfStoppedNodes = stopStoppedSupportTester.test(unpatchedAudioContext);
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
                return Promise.reject(invalidStateErrorFactory.create());
            }

            // bug #10: Edge does not provide a close method.
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
                        throw invalidStateErrorFactory.create();
                    });
            }

            // If the state was set to suspended before it should be revoked now.
            if (this._state === 'suspended') {
                this._state = null;
            }

            return this._unpatchedAudioContext.close();
        }

        createAnalyser () {
            var analyserNode;

            if (this._state === 'suspended') {
                this._state = 'running';

                if (this._onStateChangeListener !== null) {
                    this._onStateChangeListener();
                }
            }

            if (this._unpatchedAudioContext === null) {
                throw invalidStateErrorFactory.create();
            }

            analyserNode = this._unpatchedAudioContext.createAnalyser();

            // If the unpatched AudioContext throws an error by itself, this code will never get
            // executed. If it does it will imitate the behaviour of throwing an error.
            if (this.state === 'closed') {
                throw invalidStateErrorFactory.create();
            }

            // Only Firefox creates an AnalyserNode with default properties.
            if (analyserNode.channelCount === 2) {
                analyserNode.channelCount = 1;
            }

            // Safari does not support getFloatTimeDomainData() yet.
            if (typeof analyserNode.getFloatTimeDomainData !== 'function') {
                analyserNode = wrapAnalyserNode(analyserNode);
            }

            // bug #11: Edge and Safari do not support chaining yet.
            if (!this._isSupportingChaining) {
                analyserNode = audioNodeConnectMethodWrapper.wrap(analyserNode);
            }

            // Only Chrome and Opera support disconnecting of a specific destination.
            if (!this._isSupportingDisconnecting) {
                analyserNode = audioNodeDisconnectMethodWrapper.wrap(analyserNode);
            }

            return analyserNode;
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
                throw invalidStateErrorFactory.create();
            }

            biquadFilterNode = this._unpatchedAudioContext.createBiquadFilter();

            // If the unpatched AudioContext throws an error by itself, this code will never get
            // executed. If it does it will imitate the behaviour of throwing an error.
            if (this.state === 'closed') {
                throw invalidStateErrorFactory.create();
            }

            // bug #11: Edge and Safari do not support chaining yet.
            if (!this._isSupportingChaining) {
                biquadFilterNode = audioNodeConnectMethodWrapper.wrap(biquadFilterNode);
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
                audioBuffer = audioBufferWrapper.wrap(audioBuffer);
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

            // bug #19: Safari does not ignore calls to stop() of an already stopped
            // AudioBufferSourceNode.
            if (!this._isSupportingStoppingOfStoppedNodes) {
                return audioBufferSourceNodeStopMethodWrapper.wrap(audioBufferSourceNode);
            }

            // bug #11: Edge and Safari do not support chaining yet. But Safari is already patched
            // above.
            if (!this._isSupportingChaining) {
                return audioNodeConnectMethodWrapper.wrap(audioBufferSourceNode);
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
                throw invalidStateErrorFactory.create();
            }

            channelMergerNode = this._unpatchedAudioContext.createChannelMerger.apply(this._unpatchedAudioContext, arguments);

            // If the unpatched AudioContext throws an error by itself, this code will never get
            // executed. If it does it will imitate the behaviour of throwing an error.
            if (this.state === 'closed') {
                throw invalidStateErrorFactory.create();
            }

            // bug #11: Edge and Safari do not support chaining yet.
            if (!this._isSupportingChaining) {
                channelMergerNode = audioNodeConnectMethodWrapper.wrap(channelMergerNode);
            }

            // bug #15: Safari does not return the default properties.
            if (channelMergerNode.channelCount !== 1 &&
                    channelMergerNode.channelCountMode !== 'explicit') {
                channelMergerNode = channelMergerNodeWrapper.wrap(this._unpatchedAudioContext, channelMergerNode);
            }

            // bug #16: Firefox does not throw an error when setting a different channelCount or
            // channelCountMode.
            try {
                channelMergerNode.channelCount = 2;

                channelMergerNode = channelMergerNodeWrapper.wrap(this._unpatchedAudioContext, channelMergerNode);
            } catch (err) {}

            return channelMergerNode; // eslint-disable-line newline-before-return
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
                throw invalidStateErrorFactory.create();
            }

            channelSplitterNode = this._unpatchedAudioContext.createChannelSplitter.apply(this._unpatchedAudioContext, arguments);

            // If the unpatched AudioContext throws an error by itself, this code will never get
            // executed. If it does it will imitate the behaviour of throwing an error.
            if (this.state === 'closed') {
                throw invalidStateErrorFactory.create();
            }

            // bug #11: Edge and Safari do not support chaining yet.
            if (!this._isSupportingChaining) {
                channelSplitterNode = audioNodeConnectMethodWrapper.wrap(channelSplitterNode);
            }

            // bug #29 - #32: Only Chrome Canary partially supports the spec yet.
            return channelSplitterNodeWrapper.wrap(channelSplitterNode);
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
                throw invalidStateErrorFactory.create();
            }

            gainNode = this._unpatchedAudioContext.createGain();

            // If the unpatched AudioContext throws an error by itself, this code will never get
            // executed. If it does it will imitate the behaviour of throwing an error.
            if (this.state === 'closed') {
                throw invalidStateErrorFactory.create();
            }

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

        createIIRFilter (feedforward, feedback) {
            var iIRFilterNode;

            // bug #10: Edge does not throw an error when the context is closed.
            if (this._unpatchedAudioContext === null && this.state === 'closed') {
                throw invalidStateErrorFactory.create();
            }

            // bug #9: Only Chrome and Opera currently implement the createIIRFilter() method.
            if (this._unpatchedAudioContext.createIIRFilter === undefined) {
                return iIRFilterNodeFaker.fake(feedforward, feedback, this, this._unpatchedAudioContext);
            }

            iIRFilterNode = this._unpatchedAudioContext.createIIRFilter(feedforward, feedback);

            // bug 23 & 24: FirefoxDeveloper does not throw NotSupportedErrors anymore.
            if (!this._isSupportingGetFrequencyResponseErrors) {
                iIRFilterNodeGetFrequencyResponseMethodWrapper.wrap(iIRFilterNode);
            }

            return iIRFilterNode;
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
                throw invalidStateErrorFactory.create();
            }

            oscillatorNode = this._unpatchedAudioContext.createOscillator();

            // If the unpatched AudioContext throws an error by itself, this code will never get
            // executed. If it does it will imitate the behaviour of throwing an error.
            if (this.state === 'closed') {
                throw invalidStateErrorFactory.create();
            }

            // bug #11: Edge and Safari do not support chaining yet.
            if (!this._isSupportingChaining) {
                oscillatorNode = audioNodeConnectMethodWrapper.wrap(oscillatorNode);
            }

            return oscillatorNode;
        }

        decodeAudioData (audioData, successCallback, errorCallback) {
            if (this._state === 'suspended') {
                this._state = 'running';

                if (this._onStateChangeListener !== null) {
                    this._onStateChangeListener();
                }
            }

            // bug #21 Safari does not support promises yet.
            if (this._isSupportingPromises) {
                return this._unpatchedAudioContext
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
                    this._unpatchedAudioContext.decodeAudioData(audioData, function (audioBuffer) {
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

    };
}

audioContextConstructor.parameters = [ [ new Inject(AudioBufferSourceNodeStopMethodWrapper) ], [ new Inject(AudioBufferWrapper) ], [ new Inject(AudioNodeConnectMethodWrapper) ], [ new Inject(AudioNodeDisconnectMethodWrapper) ], [ new Inject(ChainingSupportTester) ], [ new Inject(ChannelMergerNodeWrapper) ], [ new Inject(ChannelSplitterNodeWrapper) ], [ new Inject(EncodingErrorFactory) ], [ new Inject(InvalidStateErrorFactory) ], [ new Inject(IIRFilterNodeFaker) ], [ new Inject(IIRFilterNodeGetFrequencyResponseMethodWrapper) ], [ new Inject(NotSupportedErrorFactory) ], [ new Inject(PromiseSupportTester) ], [ new Inject(StopStoppedSupportTester) ], [ new Inject(unpatchedAudioContextConstructor) ] ];
