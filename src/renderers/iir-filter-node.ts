import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { ReflectiveInjector } from '@angular/core';
import { cacheTestResult } from '../helpers/cache-test-result';
import { filterBuffer } from '../helpers/filter-buffer';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { IAudioNodeRenderer, IIIRFilterNode, IMinimalOfflineAudioContext, IOfflineAudioCompletionEvent } from '../interfaces';
import {
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    unpatchedOfflineAudioContextConstructor as nptchdFflnDCntxtCnstrctr
} from '../providers/unpatched-offline-audio-context-constructor';
import { WINDOW_PROVIDER } from '../providers/window';
import { PromiseSupportTester } from '../testers/promise-support';
import {
    TNativeAudioBuffer,
    TNativeAudioBufferSourceNode,
    TNativeAudioNode,
    TNativeIIRFilterNode,
    TTypedArray,
    TUnpatchedAudioContext,
    TUnpatchedOfflineAudioContext
} from '../types';
import { AudioNodeRenderer } from './audio-node';

const injector = ReflectiveInjector.resolveAndCreate([
    PromiseSupportTester,
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    WINDOW_PROVIDER
]);

const promiseSupportTester = injector.get(PromiseSupportTester);
const unpatchedOfflineAudioContextConstructor = injector.get(nptchdFflnDCntxtCnstrctr);

const isSupportingPromises = (context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext) => cacheTestResult(
    PromiseSupportTester,
    () => promiseSupportTester.test(context)
);

export class IIRFilterNodeRenderer extends AudioNodeRenderer implements IAudioNodeRenderer {

    private _feedback: number [] | TTypedArray;

    private _feedforward: number [] | TTypedArray;

    private _length: number;

    private _nativeNode: null | TNativeAudioBufferSourceNode | TNativeIIRFilterNode;

    private _proxy: IIIRFilterNode;

    constructor (proxy: IIIRFilterNode, feedback: number[] | TTypedArray, feedforward: number[] | TTypedArray, length: number) {
        super();

        this._feedback = feedback;
        this._feedforward = feedforward;
        this._length = length;
        this._nativeNode = null;
        this._proxy = proxy;
    }

    public render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode> {
        if (this._nativeNode !== null) {
            return Promise.resolve(this._nativeNode);
        }

        try {
            this._nativeNode = <TNativeIIRFilterNode> getNativeNode(this._proxy);

            // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
            if (!isOwnedByContext(this._nativeNode, offlineAudioContext)) {
                this._nativeNode = offlineAudioContext.createIIRFilter(<any> this._feedforward, <any> this._feedback);
            }

            return this
                ._connectSources(offlineAudioContext, <TNativeAudioNode> this._nativeNode)
                .then(() => <TNativeAudioNode> this._nativeNode);

        // Bug #9: Safari does not support IIRFilterNodes.
        } catch (err) {
            const partialOfflineAudioContext = new unpatchedOfflineAudioContextConstructor(
                // Bug #47: The AudioDestinationNode in Edge and Safari gets not initialized correctly.
                (<IMinimalOfflineAudioContext> this._proxy.context).destination.channelCount,
                // Bug #17: Safari does not yet expose the length.
                (<IMinimalOfflineAudioContext> this._proxy.context).length,
                offlineAudioContext.sampleRate
            );

            return this
                ._connectSources(partialOfflineAudioContext, <TNativeAudioNode> partialOfflineAudioContext.destination)
                .then(() => {
                    // Bug #21: Safari does not support promises yet.
                    if (isSupportingPromises(partialOfflineAudioContext)) {
                        return partialOfflineAudioContext.startRendering();
                    }

                    return new Promise((resolve) => {
                        partialOfflineAudioContext.oncomplete = (event: IOfflineAudioCompletionEvent) => {
                            resolve(event.renderedBuffer);
                        };

                        partialOfflineAudioContext.startRendering();
                    });
                })
                .then((renderedBuffer) => {
                    const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                    audioBufferSourceNode.buffer = this._applyFilter(renderedBuffer, offlineAudioContext);
                    audioBufferSourceNode.start(0);

                    this._nativeNode = audioBufferSourceNode;

                    return <TNativeAudioNode> this._nativeNode;
                });
        }
    }

    private _applyFilter (renderedBuffer: TNativeAudioBuffer, offlineAudioContext: TUnpatchedOfflineAudioContext) {
        const feedback = this._feedback;
        const feedforward = this._feedforward;

        const feedbackLength = feedback.length;
        const feedforwardLength = feedforward.length;
        const minLength = Math.min(feedbackLength, feedforwardLength);

        if (feedback[0] !== 1) {
            for (let i = 0; i < feedbackLength; i += 1) {
                feedforward[i] /= feedback[0];
            }

            for (let i = 1; i < feedforwardLength; i += 1) {
                feedback[i] /= feedback[0];
            }
        }

        const bufferLength = 32;
        const xBuffer = new Float32Array(bufferLength);
        const yBuffer = new Float32Array(bufferLength);

        const filteredBuffer = offlineAudioContext.createBuffer(
            renderedBuffer.numberOfChannels,
            renderedBuffer.length,
            renderedBuffer.sampleRate
        );

        const numberOfChannels = renderedBuffer.numberOfChannels;

        for (let i = 0; i < numberOfChannels; i += 1) {
            const input = renderedBuffer.getChannelData(i);
            const output = filteredBuffer.getChannelData(i);

            // @todo Add a test which checks support for TypedArray.prototype.fill().
            xBuffer.fill(0);
            yBuffer.fill(0);

            filterBuffer(
                feedback, feedbackLength, feedforward, feedforwardLength, minLength, xBuffer, yBuffer, 0, bufferLength, input, output
            );
        }

        return filteredBuffer;
    }

}
