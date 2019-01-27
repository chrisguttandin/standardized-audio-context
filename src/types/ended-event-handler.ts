import { IAudioScheduledSourceNode } from '../interfaces';

export type TEndedEventHandler<T extends IAudioScheduledSourceNode> = (this: T, event: Event) => any;
