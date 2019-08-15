import { TNativeContext } from './native-context';

export type TExposeCurrentFrameAndCurrentTimeFunction = <T>(nativeContext: TNativeContext, fn: () => T) => T;
