import { IAudioNode } from '../interfaces';
import { TIsAnyAudioNodeFactory, TNativeAudioNode } from '../types';

export const createIsAnyAudioNode: TIsAnyAudioNodeFactory = (audioNodeStore, window) => {
    return (anything): anything is IAudioNode<any> | TNativeAudioNode => {
        return audioNodeStore.has(anything)
            || (window !== null && typeof window.AudioNode === 'function' && anything instanceof window.AudioNode);
    };
};
