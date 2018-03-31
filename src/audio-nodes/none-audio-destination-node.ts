import { createInvalidStateError } from '../factories/invalid-state-error';
import { IMinimalBaseAudioContext } from '../interfaces';
import { TNativeAudioNode } from '../types';
import { AudioNode } from './audio-node';

export class NoneAudioDestinationNode<T extends TNativeAudioNode> extends AudioNode<T> {

    constructor (context: IMinimalBaseAudioContext, nativeNode: T, channelCount: number) {
        // Bug #50 Safari does not throw an error when the context is already closed.
        if (context.state === 'closed') {
            throw createInvalidStateError();
        }

        super(context, nativeNode, channelCount);
    }

}
