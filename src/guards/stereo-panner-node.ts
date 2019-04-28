import { IAudioNode, IMinimalBaseAudioContext, IStereoPannerNode } from '../interfaces';

export const isStereoPannerNode = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>): audioNode is IStereoPannerNode<T> => {
    return (<IStereoPannerNode<T>> audioNode).pan !== undefined;
};
