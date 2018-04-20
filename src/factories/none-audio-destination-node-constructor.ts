import { IAudioNodeRenderer } from '../interfaces';
import { TContext, TNativeAudioNode, TNoneAudioDestinationNodeConstructorFactory } from '../types';

export const createNoneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructorFactory = (
    audioNodeConstructor,
    createInvalidStateError
) => {

    return class NoneAudioDestinationNode extends audioNodeConstructor {

        private _nativeAudioNode: TNativeAudioNode;

        constructor (context: TContext, nativeAudioNode: TNativeAudioNode, audioNodeRenderer: null | IAudioNodeRenderer) {
            // Bug #50 Safari does not throw an error when the context is already closed.
            if (context.state === 'closed') {
                throw createInvalidStateError();
            }

            super(context, nativeAudioNode, audioNodeRenderer);

            this._nativeAudioNode = nativeAudioNode;
        }

        public get channelCount () {
            return this._nativeAudioNode.channelCount;
        }

        public set channelCount (value) {
            this._nativeAudioNode.channelCount = value;
        }

        public get channelCountMode () {
            return this._nativeAudioNode.channelCountMode;
        }

        public set channelCountMode (value) {
            this._nativeAudioNode.channelCountMode = value;
        }

    };

};
