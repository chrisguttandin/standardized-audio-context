import { TTestAudioBufferConstructorSupportFactory } from '../types';

/*
 * Bug #33: Safari up to version 13.1 exposed an AudioBuffer but it couldn't be used as a constructor. It also had a couple more bugs but
 * since this is easy to test it's used here as a placeholder.
 *
 * Bug #15: Safari up to version 13.1 exposed the wrong default values for channelCount and channelCountMode of a ChannelMergerNode.
 *
 * Bug #16: Safari up to version 13.1 threw no error when changing the channelCount or channelCountMode of a ChannelMergerNode.
 *
 * Bug #20: Safari up to version 13.1 required a connection of any kind to treat the input signal of a ChannelMergerNode correctly.
 *
 * Bug #22: Safari up to version 13.1 filled the magResponse and phaseResponse arrays with a deprecated algorithm when calling
 * getFrequencyResponse() of a BiquadFilterNode.
 *
 * Bug #36: Safari up to version 13.1 did not support getFloatTimeDomainData() of an AnalyserNode.
 *
 * Bug #39: Safari up to version 13.1 did not expose the baseLatency property of an AudioContext.
 *
 * Bug #41: Safari up to version 13.1 threw a SyntaxError when trying to connect an AudioNode with an AudioNode of another AudioContext.
 *
 * Bug #56: Safari up to version 13.1 rejected the promise returned by resume() and suspend() without any error.
 *
 * Bug #62: Safari up to version 13.1 had no ConstantSourceNode implementation.
 *
 * Bug #68: Safari up to version 13.1 did not throw an error if the parameters of getFrequencyResponse() of a BiquadFilterNode differed in
 * their length.
 *
 * Bug #73: Safari up to version 13.1 did not expose the correct values for maxValue and minValue of the playbackRate AudioParam of an
 * AudioBufferSourceNode.
 *
 * Bug #76: Safari up to version 13.1 did not expose the correct values for maxValue and minValue of the frequency AudioParam of an
 * OscillatorNode.
 *
 * Bug #80: Safari up to version 13.1 did not expose the correct values for maxValue and minValue of the Q AudioParam of a BiquadFilterNode.
 *
 * Bug #94: Safari up to version 13.1 exposed a close() method on an OfflineAudioContext.
 *
 * Bug #99: Safari up to version 13.1 threw no error when creating an AudioBuffer without any channels.
 *
 * Bug #100: Safari up to version 13.1 threw a SyntaxError when calling getChannelData() with an out-of-bounds value.
 *
 * Bug #102: Safari up to version 13.1 threw no error when the curve had less than two samples.
 *
 * Bug #103: Safari up to version 13.1 not allowed to set the curve to null.
 *
 * Bug #113: Safari up to version 13.1 allowed to set the channelCount of a ConvolverNode to a value larger than 2.
 *
 * Bug #114: Safari up to version 13.1 allowed to set the channelCountMode of a ConvolverNode to 'max'.
 *
 * Bug #118: Safari up to version 13.1 threw no error if maxDecibels was assigned to a value less than minDecibels or minDecibels was
 * assigned to a value greater than maxDecibels.
 *
 * Bug #124: Safari up to version 13.1 did not support modifying the orientation and position of a PannerNode with AudioParams.
 *
 * Bug #125: Safari up to version 13.1 allowed to set the channelCount of a PannerNode to a value larger than 2.
 *
 * Bug #126: Safari up to version 13.1 allowed to set the channelCountMode of a PannerNode to 'max'.
 *
 * Bug #127: Safari up to version 13.1 allowed to set the coneOuterGain of a PannerNode to a value less than 0 or larger than 1.
 * *
 * Bug #128: Safari up to version 13.1 allowed to set the maxDistance of a PannerNode to a value less than 0.
 *
 * Bug #129: Safari up to version 13.1 allowed to set the refDistance of a PannerNode to a value less than 0.
 *
 * Bug #130: Safari up to version 13.1 allowed to set the rolloffFactor of a PannerNode to a value less than 0.
 *
 * Bug #131: Safari up to version 13.1 returned null when there were four other AudioContexts running already.
 *
 * Bug #140: Safari up to version 13.1 did not support creating an AudioBuffer with a sampleRate below 22050 Hz.
 *
 * Bug #143, #144 & #146: Safari up to version 13.1 threw a SyntaxError when numberOfChannels, length or sampleRate were invalid when
 * creating an OfflineAudioContext.
 *
 * Bug #147: Safari up to version 13.1 did not support to connect a signal to the playbackRate AudioParam of an AudioBufferSourceNode.
 *
 * Bug #150: Safari up to version 13.1 did not support setting the sampleRate.
 *
 * Bug #160: Safari up to version 13.1 exposed a startRendering() method on an AudioContext.
 *
 * Bug #169: Safari up to version 13.1 threw an error on each attempt to change the channelCount of an AudioDestinationNode.
 *
 * Bug #171: Safari up to version 13.1 allowed to create a MediaElementAudioSourceNode with an OfflineAudioContext.
 *
 * Bug #172: Safari up to version 13.1 allowed to create a MediaStreamAudioSourceNode with an OfflineAudioContext.
 *
 * Bug #173: Safari up to version 13.1 allowed to create a MediaStreamAudioDestinationNode with an OfflineAudioContext.
 *
 * Bug #180: Safari up to version 13.1 not allowed to use ordinary arrays as parameters of createPeriodicWave().
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
