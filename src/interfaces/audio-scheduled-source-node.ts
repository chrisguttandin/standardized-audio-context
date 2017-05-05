import { IAudioNode } from './audio-node';

export interface IAudioScheduledSourceNode extends IAudioNode {

    // @todo onended: EventHandler;

    start (when?: number): void;

    stop (when?: number): void;

}
