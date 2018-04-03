import { IMinimalBaseAudioContext } from '../interfaces';
import { TNativeAudioNode, TNoneAudioDestinationNodeConstructorFactory } from '../types';

export const createNoneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructorFactory = (
    audioNodeConstructor,
    createInvalidStateError
) => {

    return class NoneAudioDestinationNode extends audioNodeConstructor {

        private _nativeNode: TNativeAudioNode;

        constructor (context: IMinimalBaseAudioContext, nativeNode: TNativeAudioNode) {
            // Bug #50 Safari does not throw an error when the context is already closed.
            if (context.state === 'closed') {
                throw createInvalidStateError();
            }

            super(context, nativeNode);

            this._nativeNode = nativeNode;
        }

        public get channelCount () {
            return this._nativeNode.channelCount;
        }

        public set channelCount (value) {
            this._nativeNode.channelCount = value;
        }

        public get channelCountMode () {
            return this._nativeNode.channelCountMode;
        }

        public set channelCountMode (value) {
            this._nativeNode.channelCountMode = value;
        }

    };

};
