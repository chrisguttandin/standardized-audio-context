import { TAudioDestinationNodeConstructor } from './audio-destination-node-constructor';
import { TAudioListenerFactory } from './audio-listener-factory';
import { TEventTargetConstructor } from './event-target-constructor';
import { TMinimalBaseAudioContextConstructor } from './minimal-base-audio-context-constructor';
import { TWrapEventListenerFunction } from './wrap-event-listener-function';

export type TMinimalBaseAudioContextConstructorFactory = (
    audioDestinationNodeConstructor: TAudioDestinationNodeConstructor,
    createAudioListener: TAudioListenerFactory,
    eventTargetConstructor: TEventTargetConstructor,
    wrapEventListener: TWrapEventListenerFunction
) => TMinimalBaseAudioContextConstructor;
