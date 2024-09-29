import { TTestAudioBufferConstructorSupportFactory } from '../types';

/*
 * Bug #33: Safari up to version 13.1 exposed an AudioBuffer but it couldn't be used as a constructor. It also had a couple more bugs but
 * since this is easy to test it's used here as a placeholder.
 *
 * Bug #39: Safari up to version 13.1 did not expose the baseLatency property of an AudioContext.
 *
 * Bug #131: Safari up to version 13.1 returned null when there were four other AudioContexts running already.
 *
 * Bug #150: Safari up to version 13.1 did not support setting the sampleRate.
 *
 * Bug #169: Safari up to version 13.1 threw an error on each attempt to change the channelCount of an AudioDestinationNode.
 */
export const createTestAudioBufferConstructorSupport: TTestAudioBufferConstructorSupportFactory = (nativeAudioBufferConstructor) => {
    return () => {
        if (nativeAudioBufferConstructor === null) {
            return false;
        }

        try {
            new nativeAudioBufferConstructor({ length: 1, sampleRate: 44100 }); // tslint:disable-line:no-unused-expression
        } catch {
            return false;
        }

        return true;
    };
};
