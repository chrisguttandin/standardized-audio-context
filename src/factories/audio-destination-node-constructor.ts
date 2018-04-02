import { createIndexSizeError } from '../factories/index-size-error';
import { createInvalidStateError } from '../factories/invalid-state-error';
import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { createNativeAudioDestinationNode } from '../helpers/create-native-audio-destination-node';
import { getNativeContext } from '../helpers/get-native-context';
import { IAudioDestinationNode, IMinimalBaseAudioContext } from '../interfaces';
import { AudioDestinationNodeRenderer } from '../renderers/audio-destination-node';
import { TAudioDestinationNodeConstructorFactory, TNativeAudioDestinationNode } from '../types';

export const createAudioDestinationNodeConstructor: TAudioDestinationNodeConstructorFactory = (
    audioNodeConstructor,
    isNativeOfflineAudioContext
) => {

    return class AudioDestinationNode extends audioNodeConstructor implements IAudioDestinationNode {

        private _isNodeOfNativeOfflineAudioContext: boolean;

        private _nativeNode: TNativeAudioDestinationNode;

        constructor (context: IMinimalBaseAudioContext, channelCount: number) {
            const nativeContext = getNativeContext(context);
            const isNodeOfNativeOfflineAudioContext = isNativeOfflineAudioContext(nativeContext);
            const nativeNode = createNativeAudioDestinationNode(nativeContext, channelCount, isNodeOfNativeOfflineAudioContext);

            super(context, nativeNode);

            this._isNodeOfNativeOfflineAudioContext = isNodeOfNativeOfflineAudioContext;
            this._nativeNode = nativeNode;

            if (isNodeOfNativeOfflineAudioContext) {
                const audioDestinationNodeRenderer = new AudioDestinationNodeRenderer();

                AUDIO_NODE_RENDERER_STORE.set(this, audioDestinationNodeRenderer);
            }
        }

        public get channelCount () {
            return this._nativeNode.channelCount;
        }

        public set channelCount (value) {
            // Bug #52: Chrome, Edge, Opera & Safari do not throw an exception at all.
            // Bug #54: Firefox does throw an IndexSizeError.
            if (this._isNodeOfNativeOfflineAudioContext) {
                throw createInvalidStateError();
            }

            // Bug #47: The AudioDestinationNode in Edge and Safari do not initialize the maxChannelCount property correctly.
            if (value > this._nativeNode.maxChannelCount) {
                throw createIndexSizeError();
            }

            this._nativeNode.channelCount = value;
        }

        public get channelCountMode () {
            return this._nativeNode.channelCountMode;
        }

        public set channelCountMode (value) {
            // Bug #53: No browser does throw an exception yet.
            if (this._isNodeOfNativeOfflineAudioContext) {
                throw createInvalidStateError();
            }

            this._nativeNode.channelCountMode = value;
        }

        public get maxChannelCount () {
            return this._nativeNode.maxChannelCount;
        }

    };

};
