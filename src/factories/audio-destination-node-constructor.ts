import { AUDIO_GRAPHS } from '../globals';
import { getNativeContext } from '../helpers/get-native-context';
import { IAudioDestinationNode } from '../interfaces';
import { TAudioDestinationNodeConstructorFactory, TNativeAudioDestinationNode, TStandardizedContext } from '../types';

export const createAudioDestinationNodeConstructor: TAudioDestinationNodeConstructorFactory = (
    audioNodeConstructor,
    createAudioDestinationNodeRenderer,
    createIndexSizeError,
    createInvalidStateError,
    createNativeAudioDestinationNode,
    isNativeOfflineAudioContext
) => {

    return class AudioDestinationNode extends audioNodeConstructor implements IAudioDestinationNode {

        private _isNodeOfNativeOfflineAudioContext: boolean;

        private _nativeNode: TNativeAudioDestinationNode;

        constructor (context: TStandardizedContext, channelCount: number) {
            const nativeContext = getNativeContext(context);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const nativeNode = createNativeAudioDestinationNode(nativeContext, channelCount, isOffline);
            const audioDestinationNodeRenderer = (isOffline) ? createAudioDestinationNodeRenderer() : null;

            const audioGraph = { nodes: new WeakMap(), params: new WeakMap() };

            AUDIO_GRAPHS.set(context, audioGraph);
            AUDIO_GRAPHS.set(nativeContext, audioGraph);

            super(context, nativeNode, audioDestinationNodeRenderer);

            this._isNodeOfNativeOfflineAudioContext = isOffline;
            this._nativeNode = nativeNode;
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
