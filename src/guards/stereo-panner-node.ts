import { IAudioNode, IStereoPannerNode } from '../interfaces';

export const isStereoPannerNode = (audioNode: IAudioNode): audioNode is IStereoPannerNode => {
    return (audioNode.hasOwnProperty('pan'));
};
