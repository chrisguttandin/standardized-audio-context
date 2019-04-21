import { IMinimalBaseAudioContext, IStereoPannerNode, IStereoPannerOptions } from '../interfaces';

export type TStereoPannerNodeConstructor = new <T extends IMinimalBaseAudioContext>(
    context: T,
    options?: Partial<IStereoPannerOptions>
) => IStereoPannerNode<T>;
