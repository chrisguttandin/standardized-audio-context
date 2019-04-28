import { AUDIO_NODE_SYMBOL_STORE } from '../globals';
import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';

export const getSymbolOfAudioNode = <T extends IMinimalBaseAudioContext>(
    audioNode: IAudioNode<T>
): symbol => {
    const symbol = AUDIO_NODE_SYMBOL_STORE.get(audioNode);

    if (symbol === undefined) {
        throw new Error('The associated symbol is missing.');
    }

    return symbol;
};
