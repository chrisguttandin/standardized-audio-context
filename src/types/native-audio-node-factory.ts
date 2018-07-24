import { TNativeAudioNode } from './native-audio-node';
import { TNativeContext } from './native-context';

export type TNativeAudioNodeFactory = <T extends TNativeAudioNode> (
    nativeContext: TNativeContext,
    factoryFunction: (nativeContext: TNativeContext) => T
) => T;
