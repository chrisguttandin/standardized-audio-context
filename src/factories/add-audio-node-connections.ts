import { IAudioNode, IAudioNodeRenderer, IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';
import { TActiveInputConnection, TAddAudioNodeConnectionsFactory, TNativeAudioNode } from '../types';

export const createAddAudioNodeConnections: TAddAudioNodeConnectionsFactory = (audioNodeConnectionsStore) => {
    return <T extends IMinimalBaseAudioContext>(
        audioNode: IAudioNode<T>,
        audioNoderRender: T extends IMinimalOfflineAudioContext ? IAudioNodeRenderer<T, IAudioNode<T>> : null,
        nativeAudioNode: TNativeAudioNode
    ) => {
        const activeInputs = [ ];

        for (let i = 0; i < nativeAudioNode.numberOfInputs; i += 1) {
            activeInputs.push(new Set<TActiveInputConnection<T>>());
        }

        audioNodeConnectionsStore.set(audioNode, {
            activeInputs,
            outputs: new Set(),
            passiveInputs: new WeakMap(),
            renderer: audioNoderRender
        });
    };
};
