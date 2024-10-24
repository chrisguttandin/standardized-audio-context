import { IAudioDestinationNode } from '../interfaces';
import {
    TAudioDestinationNodeConstructorFactory,
    TAudioNodeRenderer,
    TChannelCountMode,
    TContext,
    TNativeAudioDestinationNode
} from '../types';

export const createAudioDestinationNodeConstructor: TAudioDestinationNodeConstructorFactory = (
    audioNodeConstructor,
    createAudioDestinationNodeRenderer,
    createInvalidStateError,
    createNativeAudioDestinationNode,
    getNativeContext,
    isNativeOfflineAudioContext,
    renderInputsOfAudioNode
) => {
    return class AudioDestinationNode<T extends TContext> extends audioNodeConstructor<T> implements IAudioDestinationNode<T> {
        private _isNodeOfNativeOfflineAudioContext: boolean;

        private _nativeAudioDestinationNode: TNativeAudioDestinationNode;

        constructor(context: T, channelCount: number) {
            const nativeContext = getNativeContext(context);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const nativeAudioDestinationNode = createNativeAudioDestinationNode(nativeContext, channelCount);
            const audioDestinationNodeRenderer = <TAudioNodeRenderer<T, this>>(
                (isOffline ? createAudioDestinationNodeRenderer(renderInputsOfAudioNode) : null)
            );

            super(context, false, nativeAudioDestinationNode, audioDestinationNodeRenderer);

            this._isNodeOfNativeOfflineAudioContext = isOffline;
            this._nativeAudioDestinationNode = nativeAudioDestinationNode;
        }

        get channelCount(): number {
            return this._nativeAudioDestinationNode.channelCount;
        }

        set channelCount(value) {
            // Bug #52: Chrome and Safari throw no exception at all.
            // Bug #54: Firefox does throw an IndexSizeError.
            if (this._isNodeOfNativeOfflineAudioContext) {
                throw createInvalidStateError();
            }

            this._nativeAudioDestinationNode.channelCount = value;
        }

        get channelCountMode(): TChannelCountMode {
            return this._nativeAudioDestinationNode.channelCountMode;
        }

        set channelCountMode(value) {
            // Bug #53: No browser does throw an exception yet.
            if (this._isNodeOfNativeOfflineAudioContext) {
                throw createInvalidStateError();
            }

            this._nativeAudioDestinationNode.channelCountMode = value;
        }

        get maxChannelCount(): number {
            return this._nativeAudioDestinationNode.maxChannelCount;
        }
    };
};
