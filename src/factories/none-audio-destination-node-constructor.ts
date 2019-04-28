import { IAudioNode, IAudioNodeRenderer, IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';
import { TInternalState, TNativeAudioNode, TNoneAudioDestinationNodeConstructorFactory } from '../types';

export const createNoneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructorFactory = (audioNodeConstructor) => {

    return class NoneAudioDestinationNode<T extends IMinimalBaseAudioContext> extends audioNodeConstructor<T> {

        constructor (
            context: T,
            internalState: TInternalState,
            nativeAudioNode: TNativeAudioNode,
            audioNodeRenderer: T extends IMinimalOfflineAudioContext ? IAudioNodeRenderer<T, IAudioNode<T>> : null
        ) {
            super(context, internalState, nativeAudioNode, audioNodeRenderer);
        }

    };

};
