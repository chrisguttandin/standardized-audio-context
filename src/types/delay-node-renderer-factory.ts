import { IAudioNodeRenderer } from '../interfaces';

export type TDelayNodeRendererFactory = (maxDelayTime: number) => IAudioNodeRenderer;
