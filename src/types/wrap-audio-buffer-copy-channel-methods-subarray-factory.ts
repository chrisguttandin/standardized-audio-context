import { TConvertNumberToUnsignedLongFunction } from './convert-number-to-unsigned-long-function';
import { TIndexSizeErrorFactory } from './index-size-error-factory';
import { TWrapAudioBufferCopyChannelMethodsSubarrayFunction } from './wrap-audio-buffer-copy-channel-methods-subarray-function';

export type TWrapAudioBufferCopyChannelMethodsSubarrayFactory = (
    convertNumberToUnsignedLong: TConvertNumberToUnsignedLongFunction,
    createIndexSizeError: TIndexSizeErrorFactory
) => TWrapAudioBufferCopyChannelMethodsSubarrayFunction;
