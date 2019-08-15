import { TExposeCurrentFrameAndCurrentTimeFactory } from '../types';

export const createExposeCurrentFrameAndCurrentTime: TExposeCurrentFrameAndCurrentTimeFactory = (window) => {
    return (nativeContext, fn) => {
        Object.defineProperties(window, {
            currentFrame: {
                configurable: true,
                get (): number {
                    return Math.round(nativeContext.currentTime * nativeContext.sampleRate);
                }
            },
            currentTime: {
                configurable: true,
                get (): number {
                    return nativeContext.currentTime;
                }
            }
        });

        try {
            return fn();
        } finally {
            if (window !== null) {
                delete (<any> window).currentFrame;
                delete (<any> window).currentTime;
            }
        }
    };
};
