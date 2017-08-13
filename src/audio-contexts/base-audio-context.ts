import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { ReflectiveInjector } from '@angular/core';
import { deallocate } from 'async-array-buffer';
import { AudioBuffer } from '../audio-buffer';
import { AudioBufferSourceNode } from '../audio-nodes/audio-buffer-source-node';
import { BiquadFilterNode } from '../audio-nodes/biquad-filter-node';
import { GainNode } from '../audio-nodes/gain-node';
import { IIRFilterNode } from '../audio-nodes/iir-filter-node';
import { DataCloneErrorFactory } from '../factories/data-clone-error';
import { EncodingErrorFactory } from '../factories/encoding-error';
import { IndexSizeErrorFactory } from '../factories/index-size-error';
import { DETACHED_ARRAY_BUFFERS } from '../globals';
import { cacheTestResult } from '../helpers/cache-test-result';
import { IAudioBuffer, IAudioBufferSourceNode, IBaseAudioContext, IBiquadFilterNode, IGainNode, IIIRFilterNode } from '../interfaces';
import { UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER } from '../providers/unpatched-offline-audio-context-constructor';
import { WINDOW_PROVIDER } from '../providers/window';
import { AudioBufferCopyChannelMethodsSupportTester } from '../testers/audio-buffer-copy-channel-methods-support';
import { PromiseSupportTester } from '../testers/promise-support';
import {
    TDecodeErrorCallback,
    TDecodeSuccessCallback,
    TTypedArray,
    TUnpatchedAudioContext,
    TUnpatchedOfflineAudioContext
} from '../types';
import { AudioBufferWrapper } from '../wrappers/audio-buffer';
import { AudioBufferCopyChannelMethodsWrapper } from '../wrappers/audio-buffer-copy-channel-methods';
import { MinimalBaseAudioContext } from './minimal-base-audio-context';

const injector = ReflectiveInjector.resolveAndCreate([
    AudioBufferCopyChannelMethodsSupportTester,
    AudioBufferCopyChannelMethodsWrapper,
    AudioBufferWrapper,
    DataCloneErrorFactory,
    EncodingErrorFactory,
    IndexSizeErrorFactory,
    PromiseSupportTester,
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    WINDOW_PROVIDER
]);

const audioBufferCopyChannelMethodsSupportTester = injector.get(AudioBufferCopyChannelMethodsSupportTester);
const audioBufferCopyChannelMethodsWrapper = injector.get(AudioBufferCopyChannelMethodsWrapper);
const audioBufferWrapper = injector.get(AudioBufferWrapper);
const dataCloneErrorFactory = injector.get(DataCloneErrorFactory);
const encodingErrorFactory = injector.get(EncodingErrorFactory);
const promiseSupportTester = injector.get(PromiseSupportTester);

const isSupportingCopyChannelMethods = (context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext) => cacheTestResult(
    AudioBufferCopyChannelMethodsSupportTester,
    () => audioBufferCopyChannelMethodsSupportTester.test(context)
);

const isSupportingPromises = (context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext) => cacheTestResult(
    PromiseSupportTester,
    () => promiseSupportTester.test(context)
);

export class BaseAudioContext extends MinimalBaseAudioContext implements IBaseAudioContext {

    constructor (context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext, numberOfChannels: number) {
        super(context, numberOfChannels);
    }

    public createBiquadFilter (): IBiquadFilterNode {
        return new BiquadFilterNode(this);
    }

    public createBuffer (numberOfChannels: number, length: number, sampleRate: number): IAudioBuffer {
        return new AudioBuffer({ length, numberOfChannels, sampleRate });
    }

    public createBufferSource (): IAudioBufferSourceNode {
        return new AudioBufferSourceNode(this);
    }

    public createGain (): IGainNode {
        return new GainNode(this);
    }

    public createIIRFilter (feedforward: number[] | TTypedArray, feedback: number[] | TTypedArray): IIIRFilterNode {
        return new IIRFilterNode(this, { feedback, feedforward });
    }

    public decodeAudioData (
        audioData: ArrayBuffer, successCallback?: TDecodeSuccessCallback, errorCallback?: TDecodeErrorCallback
    ): Promise<AudioBuffer> {
        // Bug #43: Only Chrome and Opera do throw a DataCloneError.
        if (DETACHED_ARRAY_BUFFERS.has(audioData)) {
            const err = dataCloneErrorFactory.create();

            if (typeof errorCallback === 'function') {
                errorCallback(err);
            }

            return Promise.reject(err);
        }

        // The audioData parameter maybe of a type which can't be added to a WeakSet.
        try {
            DETACHED_ARRAY_BUFFERS.add(audioData);
        } catch (err) {
            // Ignore errors.
        }

        // Bug #21: Safari does not support promises yet.
        if (isSupportingPromises(this._context)) {
            // Bug #1: Chrome requires a successCallback.
            if (successCallback === undefined) {
                successCallback = () => {}; // tslint:disable-line:no-empty
            }

            const promise = this._context
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
                this._context.decodeAudioData(audioData, (audioBuffer: AudioBuffer) => {
                    // Bug #5: Safari does not support copyFromChannel() and copyToChannel().
                    if (typeof audioBuffer.copyFromChannel !== 'function') {
                        audioBufferWrapper.wrap(audioBuffer);
                    // Bug #42: Firefox does not yet fully support copyFromChannel() and copyToChannel().
                    } else if (!isSupportingCopyChannelMethods(this._context)) {
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

}
