import { AudioBufferWrapper } from './wrapper/audio-buffer';
import { ChannelMergerNodeWrapper } from './wrapper/channel-merger-node';
import { EncodingErrorFactory } from './factories/encoding-error';
import { Inject } from 'angular2/core';
import { InvalidStateErrorFactory } from './factories/invalid-state-error';
import { NotSupportedErrorFactory } from './factories/not-supported-error';
import { PromiseSupportTester } from './tester/promise-support';
import { unpatchedAudioContextConstructor } from './unpatched-audio-context-constructor';

var pool = [];

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

export function audioContextConstructor (audioBufferWrapper, channelMergerNodeWrapper, encodingErrorFactory, invalidStateErrorFactory, notSupportedErrorFactory, promiseSupportTester, unpatchedAudioContextConstructor) {
    return class AudioContext {

        constructor () {
            /* eslint-disable new-cap */
            var unpatchedAudioContext = (pool.length > 0) ?
                    pool.shift() : new unpatchedAudioContextConstructor();
            /* eslint-enable new-cap */

            this._isSupportingChaining = testForChainingSupport(unpatchedAudioContext);
            this._isSupportingDisconnecting = false;
            testForDisconnectingSupport(unpatchedAudioContext, (isSupportingDisconnecting) => this._isSupportingDisconnecting = isSupportingDisconnecting);
            this._isSupportingPromises = promiseSupportTester.test(unpatchedAudioContext);
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

            // Only Chrome and Firefox support chaining in their dev versions yet.
            if (!this._isSupportingChaining) {
                analyserNode = wrapAudioNodesConnectMethod(analyserNode);
            }

            // Only Chrome and Opera support disconnecting of a specific destination.
            if (!this._isSupportingDisconnecting) {
                analyserNode = wrapAudioNodesDisconnectMethod(analyserNode);
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
                throw invalidStateErrorFactory.create();
            }

            channelMergerNode = this._unpatchedAudioContext.createChannelMerger.apply(this._unpatchedAudioContext, arguments);

            // If the unpatched AudioContext throws an error by itself, this code will never get
            // executed. If it does it will imitate the behaviour of throwing an error.
            if (this.state === 'closed') {
                throw invalidStateErrorFactory.create();
            }

            // Only Chrome and Firefox support chaining in their dev versions yet.
            if (!this._isSupportingChaining) {
                channelMergerNode = wrapAudioNodesConnectMethod(channelMergerNode);
            }

            // Firefox and Safari do not return the default properties.
            if (channelMergerNode.channelCount === 2 &&
                    channelMergerNode.channelCountMode === 'max') {
                channelMergerNode = channelMergerNodeWrapper.wrap(channelMergerNode);
            }

            try {
                channelMergerNode.channelCount = 2;

                channelMergerNode = channelMergerNodeWrapper.wrap(channelMergerNode);
            } catch (err) {
                // The dev version of Firefox does not throw an error when setting a different
                // channelCount or channelCountMode.
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
                throw invalidStateErrorFactory.create();
            }

            channelSplitterNode = this._unpatchedAudioContext.createChannelSplitter.apply(this._unpatchedAudioContext, arguments);

            // If the unpatched AudioContext throws an error by itself, this code will never get
            // executed. If it does it will imitate the behaviour of throwing an error.
            if (this.state === 'closed') {
                throw invalidStateErrorFactory.create();
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
                throw invalidStateErrorFactory.create();
            }

            gainNode = this._unpatchedAudioContext.createGain();

            // If the unpatched AudioContext throws an error by itself, this code will never get
            // executed. If it does it will imitate the behaviour of throwing an error.
            if (this.state === 'closed') {
                throw invalidStateErrorFactory.create();
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

        createIIRFilter (feedforward, feedback) {
            // @todo Safari seems to support close() now too. So it does not need to be faked here.
            // It can also be removed from all other methods.

            // bug #9: Only Chrome currently implements the createIIRFilter() method.
            if (this._unpatchedAudioContext.createIIRFilter === undefined) {
                let bufferIndex = 0,
                    bufferLength = 32,
                    bufferSize,
                    feedbackLength = feedback.length,
                    feedforwardLength = feedforward.length,
                    gainNode,
                    minLength,
                    nyquist,
                    scriptProcessorNode,
                    xBuffer,
                    yBuffer;

                if (feedforward.length === 0 || feedforward.length > 20 || feedback.length === 0 || feedback.length > 20) {
                    throw notSupportedErrorFactory.create();
                }

                if (feedforward[0] === 0 || feedback[0] === 0) {
                    throw invalidStateErrorFactory.create();
                }

                if (feedback[0] !== 1) {
                    for (let i = 0, length = feedforward.length; i < length; i += 1) {
                        feedforward[i] /= feedback[0];
                    }

                    for (let i = 1, length = feedback.length; i < length; i += 1) {
                        feedback[i] /= feedback[0];
                    }
                }

                gainNode = this.createGain();
                nyquist = this.sampleRate / 2;
                scriptProcessorNode = this._unpatchedAudioContext.createScriptProcessor(256, gainNode.channelCount, gainNode.channelCount);
                bufferSize = scriptProcessorNode.bufferSize;

                xBuffer = new Float32Array(bufferLength);
                yBuffer = new Float32Array(bufferLength);

                minLength = Math.min(feedbackLength, feedforwardLength);

                // @todo Use TypedArray.prototype.fill() once it lands in Safari.
                for (let i = 0; i < bufferLength; i += 1) {
                    xBuffer[i] = 0;
                    yBuffer[i] = 0;
                }

                // This implementation as shamelessly inspired by source code of
                // {@link https://chromium.googlesource.com/chromium/src.git/+/master/third_party/WebKit/Source/platform/audio/IIRFilter.cpp|Chromium's IIRFilter}.
                scriptProcessorNode.onaudioprocess = function (event) {
                    var inputBuffer = event.inputBuffer,
                        outputBuffer = event.outputBuffer;

                    for (let i = 0, numberOfChannels = inputBuffer.numberOfChannels; i < numberOfChannels; i += 1) {
                        let input = inputBuffer.getChannelData(i),
                            output = outputBuffer.getChannelData(i);

                        for (let j = 0; j < bufferSize; j += 1) {
                            let y = feedforward[0] * input[j];

                            for (let k = 1; k < minLength; k += 1) {
                                let x = (bufferIndex - k) & (bufferLength - 1); // eslint-disable-line no-bitwise

                                y += feedforward[k] * xBuffer[x];
                                y -= feedback[k] * yBuffer[x];
                            }

                            for (let k = minLength; k < feedforwardLength; k += 1) {
                                y += feedforward[k] * xBuffer[(bufferIndex - k) & (bufferLength - 1)]; // eslint-disable-line no-bitwise
                            }

                            for (let k = minLength; k < feedbackLength; k += 1) {
                                y -= feedback[k] * yBuffer[(bufferIndex - k) & (bufferLength - 1)]; // eslint-disable-line no-bitwise
                            }

                            xBuffer[bufferIndex] = input[j];
                            yBuffer[bufferIndex] = y;

                            bufferIndex = (bufferIndex + 1) & (bufferLength - 1); // eslint-disable-line no-bitwise

                            output[j] = y;
                        }
                    }
                };

                function divide (a, b) {
                    var denominator = b[0] * b[0] + b[1] * b[1];

                    return [ ((a[0] * b[0] + a[1] * b[1]) / denominator), ((a[1] * b[0] - a[0] * b[1]) / denominator) ];
                }

                function multiply (a, b) {
                    return [ (a[0] * b[0] - a[1] * b[1]), (a[0] * b[1] + a[1] * b[0]) ];
                }

                function evaluatePolynomial (coefficient, z) {
                    var result = [ 0, 0 ];

                    for (let i = coefficient.length - 1; i >= 0; i -= 1) {
                        result = multiply(result, z);

                        result[0] += coefficient[i];
                    }

                    return result;
                }

                gainNode.getFrequencyResponse = function (frequencyHz, magResponse, phaseResponse) {
                    if (magResponse.length === 0 || phaseResponse.length === 0) {
                        throw notSupportedErrorFactory.create();
                    }

                    for (let i = 0, length = frequencyHz.length; i < length; i += 1) {
                        let denominator,
                            numerator,
                            omega,
                            response,
                            z;

                        omega = -Math.PI * (frequencyHz[i] / nyquist);
                        z = [ Math.cos(omega), Math.sin(omega) ];
                        numerator = evaluatePolynomial(feedforward, z);
                        denominator = evaluatePolynomial(feedback, z);
                        response = divide(numerator, denominator);

                        magResponse[i] = Math.sqrt(response[0] * response[0] + response[1] * response[1]);
                        phaseResponse[i] = Math.atan2(response[1], response[0]);
                    }
                };

                gainNode.connect(scriptProcessorNode);

                gainNode.connect = function (destination) {
                    // @todo Directly return the scriptProcessorNodeNode once it supports chaining.
                    scriptProcessorNode.connect.apply(scriptProcessorNode, arguments);

                    // @todo Test this expectation.
                    // Only Chrome and Firefox support chaining in their dev versions yet.
                    return destination;
                };

                return gainNode;
            }

            return this._unpatchedAudioContext.createIIRFilter(feedforward, feedback);
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

            // Only Chrome and Firefox support chaining in their dev versions yet.
            if (!this._isSupportingChaining) {
                oscillatorNode = wrapAudioNodesConnectMethod(oscillatorNode);
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

            if (this._isSupportingPromises) {
                return this._unpatchedAudioContext
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
                    this._unpatchedAudioContext.decodeAudioData(audioData, function (audioBuffer) {
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

audioContextConstructor.parameters = [ [ new Inject(AudioBufferWrapper) ], [ new Inject(ChannelMergerNodeWrapper) ], [ new Inject(EncodingErrorFactory) ], [ new Inject(InvalidStateErrorFactory) ], [ new Inject(NotSupportedErrorFactory) ], [ new Inject(PromiseSupportTester) ], [ new Inject(unpatchedAudioContextConstructor) ] ];
