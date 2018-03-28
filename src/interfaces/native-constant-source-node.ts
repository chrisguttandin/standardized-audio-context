import { INativeConstantSourceNodeMap } from './native-constant-source-node-map';

// @todo Since there are no native types yet they need to be crafted.
export interface INativeConstantSourceNode extends AudioNode {

    readonly offset: AudioParam;

    onended: ((this: INativeConstantSourceNode, event: Event) => any) | null;

    addEventListener <K extends keyof INativeConstantSourceNodeMap> (
        type: K,
        listener: (this: OscillatorNode, ev: INativeConstantSourceNodeMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener (
        type: string,
        listener: any, // @todo EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void;

    removeEventListener <K extends keyof INativeConstantSourceNodeMap> (
        type: K,
        listener: (this: OscillatorNode, ev: INativeConstantSourceNodeMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void;
    removeEventListener (
        type: string,
        listener: any, // @todo EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void;

    start (when?: number): void;

    stop (when?: number): void;

}
