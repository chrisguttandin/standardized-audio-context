import { Injector } from '@angular/core';
import { cacheTestResult } from '../helpers/cache-test-result';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { IAudioWorkletNode, IMinimalOfflineAudioContext, INativeAudioWorkletNode, IOfflineAudioCompletionEvent } from '../interfaces';
import {
    NATIVE_AUDIO_WORKLET_NODE_CONSTRUCTOR_PROVIDER,
    nativeAudioWorkletNodeConstructor as ntvDWrkltNdCnstrctr
} from '../providers/native-audio-worklet-node-constructor';
import {
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    unpatchedOfflineAudioContextConstructor as nptchdFflnDCntxtCnstrctr
} from '../providers/unpatched-offline-audio-context-constructor';
import { WINDOW_PROVIDER } from '../providers/window';
import { PROMISE_SUPPORT_TESTER_PROVIDER, PromiseSupportTester } from '../support-testers/promise';
import {
    TNativeAudioBuffer,
    TNativeAudioBufferSourceNode,
    TNativeAudioNode,
    TUnpatchedAudioContext,
    TUnpatchedOfflineAudioContext
} from '../types';
import { AudioNodeRenderer } from './audio-node';

const injector = Injector.create({
    providers: [
        NATIVE_AUDIO_WORKLET_NODE_CONSTRUCTOR_PROVIDER,
        PROMISE_SUPPORT_TESTER_PROVIDER,
        UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
        WINDOW_PROVIDER
    ]
});

const nativeAudioWorkletNodeConstructor = injector.get(ntvDWrkltNdCnstrctr);
const promiseSupportTester = injector.get(PromiseSupportTester);
const unpatchedOfflineAudioContextConstructor = injector.get(nptchdFflnDCntxtCnstrctr);

const isSupportingPromises = (context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext) => cacheTestResult(
    PromiseSupportTester,
    () => promiseSupportTester.test(context)
);

export class AudioWorkletNodeRenderer extends AudioNodeRenderer {

    private _name: string;

    private _nativeNode: null | TNativeAudioBufferSourceNode | INativeAudioWorkletNode;

    private _proxy: IAudioWorkletNode;

    constructor (proxy: IAudioWorkletNode, name: string) {
        super();

        this._name = name;
        this._nativeNode = null;
        this._proxy = proxy;
    }

    public render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode> {
        if (unpatchedOfflineAudioContextConstructor === null) {
            throw new Error(); // @todo
        }

        if (this._nativeNode !== null) {
            return Promise.resolve(this._nativeNode);
        }

        try {
            this._nativeNode = <INativeAudioWorkletNode> getNativeNode(this._proxy);

            if (nativeAudioWorkletNodeConstructor === null) {
                throw new Error(); // @todo
            }

            // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
            if (!isOwnedByContext(this._nativeNode, offlineAudioContext)) {
                this._nativeNode = new nativeAudioWorkletNodeConstructor(offlineAudioContext, this._name);
            }

            return this
                ._connectSources(offlineAudioContext, <TNativeAudioNode> this._nativeNode)
                .then(() => <TNativeAudioNode> this._nativeNode);

        // Bug #61: Only Chrome Canary has an implementation of the AudioWorkletNode yet.
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

                    return new Promise<TNativeAudioBuffer>((resolve) => {
                        partialOfflineAudioContext.oncomplete = (event: IOfflineAudioCompletionEvent) => {
                            resolve(event.renderedBuffer);
                        };

                        partialOfflineAudioContext.startRendering();
                    });
                })
                .then((renderedBuffer) => {
                    const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                    audioBufferSourceNode.buffer = renderedBuffer;
                    audioBufferSourceNode.start(0);

                    this._nativeNode = audioBufferSourceNode;

                    return <TNativeAudioNode> this._nativeNode;
                });
        }
    }

}
