import { AUDIO_GRAPHS } from '../globals';
import { TContext, TNativeContext } from '../types';

export const deleteAudioGraph = (context: TContext, nativeContext: TNativeContext): void => {
    AUDIO_GRAPHS.delete(context);
    AUDIO_GRAPHS.delete(nativeContext);
};
