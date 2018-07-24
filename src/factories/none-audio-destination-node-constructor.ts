import { IAudioNodeRenderer } from '../interfaces';
import { TContext, TNativeAudioNode, TNoneAudioDestinationNodeConstructorFactory } from '../types';

export const createNoneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructorFactory = (audioNodeConstructor) => {

    return class NoneAudioDestinationNode extends audioNodeConstructor {

        constructor (context: TContext, nativeAudioNode: TNativeAudioNode, audioNodeRenderer: null | IAudioNodeRenderer) {
            super(context, nativeAudioNode, audioNodeRenderer);
        }

    };

};
