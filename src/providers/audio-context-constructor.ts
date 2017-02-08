import { OpaqueToken } from '@angular/core';
import { EncodingErrorFactory } from '../factories/encoding-error';
import { InvalidStateErrorFactory } from '../factories/invalid-state-error';
import { IIRFilterNodeFaker } from '../fakers/iir-filter-node';
import { IAudioContext, IAudioContextConstructor } from '../interfaces/audio-context';
import { ChainingSupportTester } from '../testers/chaining-support';
import { DisconnectingSupportTester } from '../testers/disconnecting-support';
import { PromiseSupportTester } from '../testers/promise-support';
import { StopStoppedSupportTester } from '../testers/stop-stopped-support';
import { AudioBufferWrapper } from '../wrappers/audio-buffer';
import { AudioBufferSourceNodeStopMethodWrapper } from '../wrappers/audio-buffer-source-node-stop-method';
import { AudioNodeConnectMethodWrapper } from '../wrappers/audio-node-connect-method';
import { AudioNodeDisconnectMethodWrapper } from '../wrappers/audio-node-disconnect-method';
import { ChannelMergerNodeWrapper } from '../wrappers/channel-merger-node';
import { ChannelSplitterNodeWrapper } from '../wrappers/channel-splitter-node';
import { IIRFilterNodeGetFrequencyResponseMethodWrapper } from '../wrappers/iir-filter-node-get-frequency-response-method';
import { unpatchedAudioContextConstructor } from './unpatched-audio-context-constructor';

const wrapAnalyserNode = (analyserNode) => {
    analyserNode.getFloatTimeDomainData = (array) => {
        const byteTimeDomainData = new Uint8Array(array.length);

        analyserNode.getByteTimeDomainData(byteTimeDomainData);

        for (let i = 0, length = Math.max(byteTimeDomainData.length, analyserNode.fftSize); i < length; i += 1) {
            array[i] = (byteTimeDomainData[i] - 128) * 0.0078125;
        }

        return array;
    };

    return analyserNode;
};

export const audioContextConstructor = new OpaqueToken('AUDIO_CONTEXT_CONSTRUCTOR');

export const AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER = {
    deps: [
        AudioBufferSourceNodeStopMethodWrapper,
        AudioBufferWrapper,
        AudioNodeConnectMethodWrapper,
        AudioNodeDisconnectMethodWrapper,
        ChainingSupportTester,
        ChannelMergerNodeWrapper,
        ChannelSplitterNodeWrapper,
        DisconnectingSupportTester,
        EncodingErrorFactory,
        InvalidStateErrorFactory,
        IIRFilterNodeFaker,
        IIRFilterNodeGetFrequencyResponseMethodWrapper,
        PromiseSupportTester,
        StopStoppedSupportTester,
        unpatchedAudioContextConstructor
    ],
    provide: audioContextConstructor,
    useFactory: (
        audioBufferSourceNodeStopMethodWrapper,
        audioBufferWrapper,
        audioNodeConnectMethodWrapper,
        audioNodeDisconnectMethodWrapper,
        chainingSupportTester,
        channelMergerNodeWrapper,
        channelSplitterNodeWrapper,
        disconnectingSupportTester,
        encodingErrorFactory,
        invalidStateErrorFactory,
        iIRFilterNodeFaker,
        iIRFilterNodeGetFrequencyResponseMethodWrapper,
        promiseSupportTester,
        stopStoppedSupportTester,
        UnpatchedAudioContext // tslint:disable-line:variable-name
    ): IAudioContextConstructor => {
        class AudioContext implements IAudioContext {

            private _isSupportingChaining;

            private _isSupportingDisconnecting;

            private _isSupportingGetFrequencyResponseErrors;

            private _isSupportingPromises;

            private _isSupportingStoppingOfStoppedNodes;

            private _onStateChangeListener;

            private _unpatchedAudioContext;

            private _state;

            constructor () {
                const unpatchedAudioContext = new UnpatchedAudioContext();

                this._isSupportingChaining = chainingSupportTester.test(unpatchedAudioContext);
                this._isSupportingDisconnecting = false;
                // @todo Actually check for getFrequencyResponse() errors support.
                this._isSupportingGetFrequencyResponseErrors = false;
                this._isSupportingPromises = promiseSupportTester.test(unpatchedAudioContext);
                this._isSupportingStoppingOfStoppedNodes = stopStoppedSupportTester.test(unpatchedAudioContext);
                this._onStateChangeListener = null;
                this._unpatchedAudioContext = unpatchedAudioContext;
                this._state = null;

                disconnectingSupportTester
                    .test(unpatchedAudioContext)
                    .then((isSupportingDisconnecting) => {
                        this._isSupportingDisconnecting = isSupportingDisconnecting;
                    });

                // Chrome and Opera pretend to be running right away, but fire a onstatechange event when their state actually changes to
                // 'running'.
                if (unpatchedAudioContext.state === 'running') {
                    this._state = 'suspended';

                    const revokeState = () => {
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
                        const onchange = unpatchedAudioContext.onchange;

                        if (onchange === null) {
                            unpatchedAudioContext.onchange = revokeState;
                        } else {
                            unpatchedAudioContext.onchange = (event) => {
                                revokeState();
                                onchange(event);
                            };
                        }
                    }
                }
            }

            public get currentTime () {
                return this._unpatchedAudioContext.currentTime;
            }

            public set currentTime (value) {
                this._unpatchedAudioContext.currentTime = value;

                // If the unpatched AudioContext does not throw an error by itself, it has to be faked.
                throw new TypeError();
            }

            public get destination () {
                return this._unpatchedAudioContext.destination;
            }

            public set destination (value) {
                this._unpatchedAudioContext.destination = value;

                // If the unpatched AudioContext does not throw an error by itself, it has to be faked.
                throw new TypeError();
            }

            public get onstatechange () {
                if ('onstatechange' in this._unpatchedAudioContext) {
                    return this._unpatchedAudioContext.onstatechange;
                }

                return this._onStateChangeListener;
            }

            public set onstatechange (value) {
                if ('onstatechange' in this._unpatchedAudioContext) {
                    this._unpatchedAudioContext.onstatechange = value;
                } else {
                    this._onStateChangeListener = (typeof value === 'function') ? value : null;
                }
            }

            public get sampleRate () {
                return this._unpatchedAudioContext.sampleRate;
            }

            public set sampleRate (value) {
                this._unpatchedAudioContext.sampleRate = value;

                // If the unpatched AudioContext does not throw an error by itself, it has to be faked.
                throw new TypeError();
            }

            public get state () {
                return (this._state !== null) ? this._state : this._unpatchedAudioContext.state;
            }

            public set state (value) {
                if (this._unpatchedAudioContext.state !== undefined) {
                    this._unpatchedAudioContext.state = value;
                }

                // If the unpatched AudioContext does not have a property called state or does not throw an error by itself, it has to be
                // tslint:disable-next-line:comment-format
                // faked.
                throw new TypeError();
            }

            public close () {
                // If the unpatched AudioContext does not throw an error if it was closed before, it has to be faked.
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

            public createAnalyser () {
                if (this._unpatchedAudioContext === null) {
                    throw invalidStateErrorFactory.create();
                }

                let analyserNode = this._unpatchedAudioContext.createAnalyser();

                // If the unpatched AudioContext throws an error by itself, this code will never get executed. If it does it will imitate
                // tslint:disable-next-line:comment-format
                // the behaviour of throwing an error.
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

                // Bug #11: Safari does not support chaining yet.
                if (!this._isSupportingChaining) {
                    analyserNode = audioNodeConnectMethodWrapper.wrap(analyserNode);
                }

                // Only Chrome and Opera support disconnecting of a specific destination.
                if (!this._isSupportingDisconnecting) {
                    analyserNode = audioNodeDisconnectMethodWrapper.wrap(analyserNode);
                }

                return analyserNode;
            }

            public createBiquadFilter () {
                if (this._unpatchedAudioContext === null) {
                    throw invalidStateErrorFactory.create();
                }

                let biquadFilterNode = this._unpatchedAudioContext.createBiquadFilter();

                // If the unpatched AudioContext throws an error by itself, this code will never get executed. If it does it will imitate
                // tslint:disable-next-line:comment-format
                // the behaviour of throwing an error.
                if (this.state === 'closed') {
                    throw invalidStateErrorFactory.create();
                }

                // Bug #11: Safari does not support chaining yet.
                if (!this._isSupportingChaining) {
                    biquadFilterNode = audioNodeConnectMethodWrapper.wrap(biquadFilterNode);
                }

                return biquadFilterNode;
            }

            public createBuffer (numberOfChannels, length, sampleRate) {
                let audioBuffer = this._unpatchedAudioContext.createBuffer(numberOfChannels, length, sampleRate);

                // Safari does not support copyFromChannel() and copyToChannel().
                if (typeof audioBuffer.copyFromChannel !== 'function') {
                    audioBuffer = audioBufferWrapper.wrap(audioBuffer);
                }

                return audioBuffer;
            }

            public createBufferSource () {
                const audioBufferSourceNode = this._unpatchedAudioContext.createBufferSource();

                // Bug #19: Safari does not ignore calls to stop() of an already stopped AudioBufferSourceNode.
                if (!this._isSupportingStoppingOfStoppedNodes) {
                    return audioBufferSourceNodeStopMethodWrapper.wrap(audioBufferSourceNode);
                }

                // Bug #11: Safari does not support chaining yet but is already patched above.

                return audioBufferSourceNode;
            }

            public createChannelMerger (/* numberOfInputs */) {
                if (this._unpatchedAudioContext === null) {
                    throw invalidStateErrorFactory.create();
                }

                let channelMergerNode = this._unpatchedAudioContext.createChannelMerger.apply(this._unpatchedAudioContext, arguments);

                // If the unpatched AudioContext throws an error by itself, this code will never get executed. If it does it will imitate
                // tslint:disable-next-line:comment-format
                // the behaviour of throwing an error.
                if (this.state === 'closed') {
                    throw invalidStateErrorFactory.create();
                }

                // Bug #11: Safari does not support chaining yet.
                if (!this._isSupportingChaining) {
                    channelMergerNode = audioNodeConnectMethodWrapper.wrap(channelMergerNode);
                }

                // Bug #15: Safari does not return the default properties.
                if (channelMergerNode.channelCount !== 1 &&
                        channelMergerNode.channelCountMode !== 'explicit') {
                    channelMergerNode = channelMergerNodeWrapper.wrap(this._unpatchedAudioContext, channelMergerNode);
                }

                // Bug #16: Firefox does not throw an error when setting a different channelCount or channelCountMode.
                try {
                    channelMergerNode.channelCount = 2;

                    channelMergerNode = channelMergerNodeWrapper.wrap(this._unpatchedAudioContext, channelMergerNode);
                } catch (err) {} // tslint:disable-line:no-empty

                return channelMergerNode;
            }

            public createChannelSplitter (/* numberOfOutputs */) {
                if (this._unpatchedAudioContext === null) {
                    throw invalidStateErrorFactory.create();
                }

                let channelSplitterNode = this._unpatchedAudioContext.createChannelSplitter.apply(this._unpatchedAudioContext, arguments);

                // If the unpatched AudioContext throws an error by itself, this code will never get executed. If it does it will imitate
                // tslint:disable-next-line:comment-format
                // the behaviour of throwing an error.
                if (this.state === 'closed') {
                    throw invalidStateErrorFactory.create();
                }

                // Bug #11: Safari does not support chaining yet.
                if (!this._isSupportingChaining) {
                    channelSplitterNode = audioNodeConnectMethodWrapper.wrap(channelSplitterNode);
                }

                // Bug #29 - #32: Only Chrome partially supports the spec yet.
                return channelSplitterNodeWrapper.wrap(channelSplitterNode);
            }

            public createGain () {
                if (this._unpatchedAudioContext === null) {
                    throw invalidStateErrorFactory.create();
                }

                let gainNode = this._unpatchedAudioContext.createGain();

                // If the unpatched AudioContext throws an error by itself, this code will never get executed. If it does it will imitate
                // tslint:disable-next-line:comment-format
                // the behaviour of throwing an error.
                if (this.state === 'closed') {
                    throw invalidStateErrorFactory.create();
                }

                // Bug #11: Safari does not support chaining yet.
                if (!this._isSupportingChaining) {
                    gainNode = audioNodeConnectMethodWrapper.wrap(gainNode);
                }

                // Bug #12: Firefox and Safari do not support to disconnect a specific destination.
                if (!this._isSupportingDisconnecting) {
                    gainNode = audioNodeDisconnectMethodWrapper.wrap(gainNode);
                }

                return gainNode;
            }

            public createIIRFilter (feedforward, feedback) {
                // Bug #10: Edge does not throw an error when the context is closed.
                if (this._unpatchedAudioContext === null && this.state === 'closed') {
                    throw invalidStateErrorFactory.create();
                }

                // Bug #9: Safari does not support IIRFilterNodes.
                if (this._unpatchedAudioContext.createIIRFilter === undefined) {
                    return iIRFilterNodeFaker.fake(feedforward, feedback, this, this._unpatchedAudioContext);
                }

                const iIRFilterNode = this._unpatchedAudioContext.createIIRFilter(feedforward, feedback);

                // Bug 23 & 24: FirefoxDeveloper does not throw NotSupportedErrors anymore.
                if (!this._isSupportingGetFrequencyResponseErrors) {
                    iIRFilterNodeGetFrequencyResponseMethodWrapper.wrap(iIRFilterNode);
                }

                return iIRFilterNode;
            }

            public createOscillator () {
                if (this._unpatchedAudioContext === null) {
                    throw invalidStateErrorFactory.create();
                }

                let oscillatorNode = this._unpatchedAudioContext.createOscillator();

                // If the unpatched AudioContext throws an error by itself, this code will never get executed. If it does it will imitate
                // tslint:disable-next-line:comment-format
                // the behaviour of throwing an error.
                if (this.state === 'closed') {
                    throw invalidStateErrorFactory.create();
                }

                // Bug #11: Safari does not support chaining yet.
                if (!this._isSupportingChaining) {
                    oscillatorNode = audioNodeConnectMethodWrapper.wrap(oscillatorNode);
                }

                return oscillatorNode;
            }

            public decodeAudioData (audioData, successCallback, errorCallback) {
                // Bug #21 Safari does not support promises yet.
                if (this._isSupportingPromises) {
                    return this._unpatchedAudioContext
                        .decodeAudioData(audioData, successCallback, (err) => {
                            if (typeof errorCallback === 'function') {
                                // Bug #7: Firefox calls the callback with undefined.
                                if (err === undefined) {
                                    errorCallback(encodingErrorFactory.create());
                                // Bug #27: Edge is rejecting invalid arrayBuffers with a DOMException.
                                } else if (err instanceof DOMException && err.name === 'NotSupportedError') {
                                    errorCallback(new TypeError());
                                } else {
                                    errorCallback(err);
                                }
                            }
                        })
                        .catch ((err) => {
                            // Bug #6: Chrome, Firefox and Opera do not call the errorCallback in case of an invalid buffer.
                            if (typeof errorCallback === 'function' && err instanceof TypeError) {
                                errorCallback(err);
                            }

                            // Bug #27: Edge is rejecting invalid arrayBuffers with a DOMException.
                            if (err instanceof DOMException && err.name === 'NotSupportedError') {
                                throw new TypeError();
                            }

                            throw err;
                        });
                }

                // Bug #21: Safari does not return a Promise yet.
                return new Promise((resolve, reject) => {
                    const fail = (err) => {
                        if (typeof errorCallback === 'function') {
                            errorCallback(err);
                        }

                        reject(err);
                    };

                    const succeed = (dBffrWrppr) => {
                        resolve(dBffrWrppr);

                        if (typeof successCallback === 'function') {
                            successCallback(dBffrWrppr);
                        }
                    };

                    // Bug #26: Safari throws a synchronous error.
                    try {
                        // Bug #1: Safari requires a successCallback.
                        this._unpatchedAudioContext.decodeAudioData(audioData, (audioBuffer) => {
                            // Bug #5: Safari does not support copyFromChannel() and copyToChannel().
                            if (typeof audioBuffer.copyFromChannel !== 'function') {
                                succeed(audioBufferWrapper.wrap(audioBuffer));
                            } else {
                                succeed(audioBuffer);
                            }
                        }, (err) => {
                            // Bug #4: Safari returns null instead of an error.
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

        return AudioContext;
    }
};
