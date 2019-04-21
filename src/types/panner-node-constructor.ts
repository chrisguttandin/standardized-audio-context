import { IMinimalBaseAudioContext, IPannerNode, IPannerOptions } from '../interfaces';

export type TPannerNodeConstructor = new <T extends IMinimalBaseAudioContext>(
    context: T,
    options?: Partial<IPannerOptions>
) => IPannerNode<T>;
