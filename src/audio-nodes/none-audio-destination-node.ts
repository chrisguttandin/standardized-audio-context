import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { ReflectiveInjector } from '@angular/core'; // tslint:disable-line:ordered-imports
import { InvalidStateErrorFactory } from '../factories/invalid-state-error';
import { IAudioNodeOptions, IMinimalBaseAudioContext } from '../interfaces';
import { TNativeAudioNode } from '../types';
import { AudioNode } from './audio-node';

const injector = ReflectiveInjector.resolveAndCreate([
    InvalidStateErrorFactory
]);

const invalidStateErrorFactory = injector.get(InvalidStateErrorFactory);

export class NoneAudioDestinationNode extends AudioNode {

    constructor (context: IMinimalBaseAudioContext, nativeNode: null | TNativeAudioNode, options: IAudioNodeOptions) {
        // Bug #50 Safari does not throw an error when the context is already closed.
        if (context.state === 'closed') {
            throw invalidStateErrorFactory.create();
        }

        super(context, nativeNode, options);
    }

}
