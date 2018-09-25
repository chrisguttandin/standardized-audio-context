import { IAudioBuffer } from '../interfaces';
import { TNativeContext } from './native-context';

export type TDecodeAudioDataFunction = (context: TNativeContext, audioData: ArrayBuffer) => Promise<IAudioBuffer>;
