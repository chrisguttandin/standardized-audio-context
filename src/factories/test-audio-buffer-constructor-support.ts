import { TTestAudioBufferConstructorSupportFactory } from '../types';

// Bug #33: Safari up to version 13.1 exposed an AudioBuffer but it couldn't be used as a constructor.
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
