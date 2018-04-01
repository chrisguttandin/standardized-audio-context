import { TBrowsernizr } from './browsernizr';

export type TIsSupportedPromiseFactory = (
    browsernizr: TBrowsernizr,
    testAudioContextCloseMethodSupport: () => boolean,
    testAudioContextDecodeAudioDataMethodTypeErrorSupport: () => Promise<boolean>,
    testAudioContextOptionsSupport: () => boolean,
    testChannelMergerNodeSupport: () => Promise<boolean>
) => Promise<boolean>;
