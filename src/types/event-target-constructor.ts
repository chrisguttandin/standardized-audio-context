import { TNativeEventTarget } from './native-event-target';

export type TEventTargetConstructor = new (nativeEventTarget: TNativeEventTarget) => TNativeEventTarget;
