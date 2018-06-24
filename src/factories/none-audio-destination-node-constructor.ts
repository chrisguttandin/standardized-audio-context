import { IAudioNodeRenderer } from '../interfaces';
import { TContext, TNativeAudioNode, TNoneAudioDestinationNodeConstructorFactory } from '../types';

export const createNoneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructorFactory = (
    audioNodeConstructor,
    createInvalidStateError
) => {

    return class NoneAudioDestinationNode extends audioNodeConstructor {

        constructor (context: TContext, nativeAudioNode: TNativeAudioNode, audioNodeRenderer: null | IAudioNodeRenderer) {
            // Bug #50 Safari does not throw an error when the context is already closed.
            if (context.state === 'closed') {
                throw createInvalidStateError();
            }

            super(context, nativeAudioNode, audioNodeRenderer);
        }

    };

};
