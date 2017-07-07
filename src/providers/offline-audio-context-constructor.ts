import { OpaqueToken } from '@angular/core';
import { deallocate } from 'async-array-buffer';
import { DataCloneErrorFactory } from '../factories/data-clone-error';
import { EncodingErrorFactory } from '../factories/encoding-error';
import { OfflineAudioBufferSourceNodeFakerFactory } from '../factories/offline-audio-buffer-source-node';
import { OfflineAudioDestinationNodeFaker, OfflineAudioDestinationNodeFakerFactory } from '../factories/offline-audio-destination-node';
import { OfflineBiquadFilterNodeFakerFactory } from '../factories/offline-biquad-filter-node';
import { OfflineGainNodeFakerFactory } from '../factories/offline-gain-node';
import { OfflineIIRFilterNodeFakerFactory } from '../factories/offline-iir-filter-node';
import {
    IAudioBufferSourceNode,
    IAudioNode,
    IBiquadFilterNode,
    IGainNode,
    IIIRFilterNode,
    IOfflineAudioCompletionEvent,
    IOfflineAudioContext,
    IOfflineAudioContextConstructor,
    IOfflineAudioNodeFaker,
    IUnpatchedOfflineAudioContextConstructor
} from '../interfaces';
import { AudioBufferCopyChannelMethodsSupportTester } from '../testers/audio-buffer-copy-channel-methods-support';
import { PromiseSupportTester } from '../testers/promise-support';
import { TDecodeErrorCallback, TDecodeSuccessCallback, TUnpatchedOfflineAudioContext } from '../types';
import { AudioBufferWrapper } from '../wrappers/audio-buffer';
import { AudioBufferCopyChannelMethodsWrapper } from '../wrappers/audio-buffer-copy-channel-methods';
import { IIRFilterNodeGetFrequencyResponseMethodWrapper } from '../wrappers/iir-filter-node-get-frequency-response-method';
import { DetachedAudioBuffers } from './detached-audio-buffers';
import { unpatchedOfflineAudioContextConstructor } from './unpatched-offline-audio-context-constructor';

export const offlineAudioContextConstructor = new OpaqueToken('OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR');

export const OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER = {
    deps: [
        AudioBufferCopyChannelMethodsSupportTester,
        AudioBufferCopyChannelMethodsWrapper,
        AudioBufferWrapper,
        DataCloneErrorFactory,
        DetachedAudioBuffers,
        EncodingErrorFactory,
        IIRFilterNodeGetFrequencyResponseMethodWrapper,
        OfflineAudioBufferSourceNodeFakerFactory,
        OfflineAudioDestinationNodeFakerFactory,
        OfflineBiquadFilterNodeFakerFactory,
        OfflineGainNodeFakerFactory,
        OfflineIIRFilterNodeFakerFactory,
        PromiseSupportTester,
        unpatchedOfflineAudioContextConstructor
    ],
    provide: offlineAudioContextConstructor,
    useFactory: (
        audioBufferCopyChannelMethodsSupportTester: AudioBufferCopyChannelMethodsSupportTester,
        audioBufferCopyChannelMethodsWrapper: AudioBufferCopyChannelMethodsWrapper,
        audioBufferWrapper: AudioBufferWrapper,
        dataCloneErrorFactory: DataCloneErrorFactory,
        detachedAudioBuffers: WeakSet<ArrayBuffer>,
        encodingErrorFactory: EncodingErrorFactory,
        iIRFilterNodeGetFrequencyResponseMethodWrapper: IIRFilterNodeGetFrequencyResponseMethodWrapper,
        offlineAudioBufferSourceNodeFakerFactory: OfflineAudioBufferSourceNodeFakerFactory,
        offlineAudioDestinationNodeFakerFactory: OfflineAudioDestinationNodeFakerFactory,
        offlineBiquadFilterNodeFakerFactory: OfflineBiquadFilterNodeFakerFactory,
        offlineGainNodeFakerFactory: OfflineGainNodeFakerFactory,
        offlineIIRFilterNodeFakerFactory: OfflineIIRFilterNodeFakerFactory,
        promiseSupportTester: PromiseSupportTester,
        nptchdFflnDCntxtCnstrctr: IUnpatchedOfflineAudioContextConstructor
    ): IOfflineAudioContextConstructor => {
        class OfflineAudioContext implements IOfflineAudioContext {

            private _destination: OfflineAudioDestinationNodeFaker;

            private _fakeNodeStore: WeakMap<IAudioNode, IOfflineAudioNodeFaker>;

            private _isSupportingCopyChannelMethods: boolean;

            private _isSupportingGetFrequencyResponseErrors: boolean;

            private _isSupportingPromises: boolean;

            private _length: number;

            private _numberOfChannels: number;

            private _unpatchedOfflineAudioContext: TUnpatchedOfflineAudioContext;

            constructor (numberOfChannels: number, length: number, sampleRate: number) {
                const fakeNodeStore = new WeakMap();

                const unpatchedOfflineAudioContext = new nptchdFflnDCntxtCnstrctr(numberOfChannels, length, sampleRate);

                this._destination = offlineAudioDestinationNodeFakerFactory.create({ fakeNodeStore, offlineAudioContext: this });
                this._fakeNodeStore = fakeNodeStore;
                this._isSupportingCopyChannelMethods = audioBufferCopyChannelMethodsSupportTester.test(unpatchedOfflineAudioContext);
                this._isSupportingGetFrequencyResponseErrors = false;
                this._isSupportingPromises = promiseSupportTester.test(unpatchedOfflineAudioContext);
                this._length = length;
                this._numberOfChannels = numberOfChannels;
                this._unpatchedOfflineAudioContext = unpatchedOfflineAudioContext;
            }

            public get currentTime (): number {
                return this._unpatchedOfflineAudioContext.currentTime;
            }

            public get destination () {
                return this._destination.proxy;
            }

            public get length (): number {
                // Bug #17: Safari does not yet expose the length.
                if (this._unpatchedOfflineAudioContext.length === undefined) {
                    return this._length;
                }

                return this._unpatchedOfflineAudioContext.length;
            }

            public get onstatechange () {
                return (<any> this._unpatchedOfflineAudioContext).onstatechange;
            }

            public set onstatechange (value: (this: IOfflineAudioContext, ev: Event) => any) {
                (<any> this._unpatchedOfflineAudioContext).onstatechange = value;
            }

            public get sampleRate (): number {
                return this._unpatchedOfflineAudioContext.sampleRate;
            }

            public get state () {
                return this._unpatchedOfflineAudioContext.state;
            }

            public createBiquadFilter (): IBiquadFilterNode {
                return offlineBiquadFilterNodeFakerFactory.create({
                    fakeNodeStore: this._fakeNodeStore,
                    nativeNode: this._unpatchedOfflineAudioContext.createBiquadFilter(),
                    offlineAudioContext: this
                }).proxy;
            }

            public createBuffer (numberOfChannels: number, length: number, sampleRate: number): AudioBuffer {
                // @todo Consider browsers which do not fully support this method yet.
                return this._unpatchedOfflineAudioContext.createBuffer(numberOfChannels, length, sampleRate);
            }

            public createBufferSource (): IAudioBufferSourceNode {
                return offlineAudioBufferSourceNodeFakerFactory.create({
                    fakeNodeStore: this._fakeNodeStore,
                    offlineAudioContext: this
                }).proxy;
            }

            public createGain (): IGainNode {
                return offlineGainNodeFakerFactory.create({
                    fakeNodeStore: this._fakeNodeStore,
                    offlineAudioContext: this
                }).proxy;
            }

            public createIIRFilter (feedforward: number[], feedback: number[]): IIIRFilterNode {
                let nativeNode = null;

                // Bug #9: Safari does not support IIRFilterNodes.
                if (this._unpatchedOfflineAudioContext.createIIRFilter !== undefined) {
                    nativeNode = <IIIRFilterNode> this._unpatchedOfflineAudioContext.createIIRFilter(feedforward, feedback);

                    // Bug 23 & 24: FirefoxDeveloper does not throw NotSupportedErrors anymore.
                    if (!this._isSupportingGetFrequencyResponseErrors) {
                        iIRFilterNodeGetFrequencyResponseMethodWrapper.wrap(nativeNode);
                    }
                }

                return offlineIIRFilterNodeFakerFactory.create({
                    fakeNodeStore: this._fakeNodeStore,
                    feedback,
                    feedforward,
                    length: this.length,
                    nativeNode,
                    numberOfChannels: this._numberOfChannels,
                    offlineAudioContext: this,
                    sampleRate: this._unpatchedOfflineAudioContext.sampleRate
                }).proxy;
            }

            public decodeAudioData (
                audioData: ArrayBuffer, successCallback?: TDecodeSuccessCallback, errorCallback?: TDecodeErrorCallback
            ): Promise<AudioBuffer> {
                // Bug #43: Only Chrome and Opera do throw a DataCloneError.
                if (detachedAudioBuffers.has(audioData)) {
                    const err = dataCloneErrorFactory.create();

                    if (typeof errorCallback === 'function') {
                        errorCallback(err);
                    }

                    return Promise.reject(err);
                }

                // The audioData parameter maybe of a type which can't be added to a WeakSet.
                try {
                    detachedAudioBuffers.add(audioData);
                } catch (err) {
                    // Ignore errors.
                }

                // Bug #21: Safari does not support promises yet.
                if (this._isSupportingPromises) {
                    // Bug #1: Chrome requires a successCallback.
                    if (successCallback === undefined) {
                        successCallback = () => {}; // tslint:disable-line:no-empty
                    }

                    const promise = this._unpatchedOfflineAudioContext
                        .decodeAudioData(audioData, successCallback, (err: DOMException | Error) => {
                            if (typeof errorCallback === 'function') {
                                // Bug #27: Edge is rejecting invalid arrayBuffers with a DOMException.
                                if (err instanceof DOMException && err.name === 'NotSupportedError') {
                                    errorCallback(new TypeError());
                                } else {
                                    errorCallback(err);
                                }
                            }
                        })
                        .catch ((err: DOMException | Error) => {
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

                    setTimeout(() => {
                        try {
                            deallocate(audioData);
                        } catch (err) { /* Ignore errors. */ }
                    });

                    return promise;
                }

                // Bug #21: Safari does not return a Promise yet.
                return new Promise((resolve, reject) => {
                    const fail = (err: DOMException | Error) => {
                        if (typeof errorCallback === 'function') {
                            errorCallback(err);
                        }

                        reject(err);
                    };

                    const succeed = (dBffrWrppr: AudioBuffer) => {
                        resolve(dBffrWrppr);

                        if (typeof successCallback === 'function') {
                            successCallback(dBffrWrppr);
                        }
                    };

                    // Bug #26: Safari throws a synchronous error.
                    try {
                        // Bug #1: Safari requires a successCallback.
                        this._unpatchedOfflineAudioContext.decodeAudioData(audioData, (audioBuffer: AudioBuffer) => {
                            // Bug #5: Safari does not support copyFromChannel() and copyToChannel().
                            if (typeof audioBuffer.copyFromChannel !== 'function') {
                                audioBufferWrapper.wrap(audioBuffer);
                            // Bug #42: Firefox does not yet fully support copyFromChannel() and copyToChannel().
                            } else if (!this._isSupportingCopyChannelMethods) {
                                audioBufferCopyChannelMethodsWrapper.wrap(audioBuffer);
                            }

                            succeed(audioBuffer);
                        }, (err: DOMException | Error) => {
                            // Bug #4: Safari returns null instead of an error.
                            if (err === null) {
                                fail(encodingErrorFactory.create());
                            } else {
                                fail(err);
                            }
                        });

                        setTimeout(() => {
                            try {
                                deallocate(audioData);
                            } catch (err) { /* Ignore errors. */ }
                        });
                    } catch (err) {
                        fail(err);
                    }
                });
            }

            // @todo public resume () {
            // @todo     return this._unpatchedOfflineAudioContext.resume();
            // @todo }

            public startRendering () {
                return this._destination
                    .render(this._unpatchedOfflineAudioContext)
                    .then(() => {
                        // Bug #21: Safari does not support promises yet.
                        if (this._isSupportingPromises) {
                            return this._unpatchedOfflineAudioContext.startRendering();
                        }

                        return new Promise((resolve) => {
                            (<any> this._unpatchedOfflineAudioContext).oncomplete = (event: IOfflineAudioCompletionEvent) => {
                                resolve(event.renderedBuffer);
                            };

                            this._unpatchedOfflineAudioContext.startRendering();
                        });
                    });
            }

            // @todo public suspend (suspendTime) {
            // @todo     return this._unpatchedOfflineAudioContext.suspend(suspendTime);
            // @todo }

        }

        return OfflineAudioContext;
    }
};
