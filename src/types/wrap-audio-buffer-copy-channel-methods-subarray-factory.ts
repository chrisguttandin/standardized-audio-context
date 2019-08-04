import { TConvertNumberToUnsignedLongFunction } from './convert-number-to-unsigned-long-function';
import { TIndexSizeErrorFactory } from './index-size-error-factory';
import { TWrapAudioBufferCopyChannelMethodsSubArrayFunction } from './wrap-audio-buffer-copy-channel-methods-subarray-function';

export type TWrapAudioBufferCopyChannelMethodsSubArrayFactory = (
    convertNumberToUnsignedLong: TConvertNumberToUnsignedLongFunction,
    createIndexSizeError: TIndexSizeErrorFactory
) => TWrapAudioBufferCopyChannelMethodsSubArrayFunction;
