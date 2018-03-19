// @todo Since there are no native types yet they need to be crafted.
export interface INativeConstantSourceNode extends AudioNode {

    readonly offset: AudioParam;

    onended: ((this: INativeConstantSourceNode, event: Event) => any) | null;

    start (when?: number): void;

    stop (when?: number): void;

}
