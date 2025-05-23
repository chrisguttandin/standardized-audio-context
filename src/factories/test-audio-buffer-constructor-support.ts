import { TTestAudioBufferConstructorSupportFactory } from '../types';

/*
 * Bug #33: Safari up to version 13.1 exposed an AudioBuffer but it couldn't be used as a constructor. It also had a couple more bugs but
 * since this is easy to test it's used here as a placeholder.
 *
 * Bug #1: Safari up to version 13.1 required a successCallback when calling decodeAudioData().
 *
 * Bug #5: Safari up to version 13.1 had no implementation for the copyFromChannel() and copyToChannel() methods of an AudioBuffer.
 *
 * Bug #8: Safari up to version 13.1 did not dispatch every expected 'audioprocess' event when rendering a ScriptProcessorNode on an
 * OfflineAudioContext.
 *
 * Bug #9: Safari up to version 13.1 had no IIRFilterNode implementation.
 *
 * Bug #12: Safari up to version 13.1 not allowed to disconnect a specific destination.
 *
 * Bug #13: Safari up to version 13.1 did not render any output of a ScriptProcessorNode when used with an OfflineAudioContext.
 *
 * Bug #15: Safari up to version 13.1 exposed the wrong default values for channelCount and channelCountMode of a ChannelMergerNode.
 *
 * Bug #16: Safari up to version 13.1 threw no error when changing the channelCount or channelCountMode of a ChannelMergerNode.
 *
 * Bug #17: Safari up to version 13.1 did not expose the length property of an OfflineAudioContext.
 *
 * Bug #18: Safari up to version 13.1 threw an error when calling stop() of an AudioBufferSourceNode more than once.
 *
 * Bug #19: Safari up to version 13.1 threw an error when calling stop() of an already stopped AudioBufferSourceNode.
 *
 * Bug #20: Safari up to version 13.1 required a connection of any kind to treat the input signal of a ChannelMergerNode correctly.
 *
 * Bug #21: Safari up to version 13.1 returned no promise when calling decodeAudioData() or startRendering().
 *
 * Bug #22: Safari up to version 13.1 filled the magResponse and phaseResponse arrays with a deprecated algorithm when calling
 * getFrequencyResponse() of a BiquadFilterNode.
 *
 * Bug #26: Safari up to version 13.1 possibly threw a synchronous error when calling decodeAudioData().
 *
 * Bug #29: Safari up to version 13.1 exposed the wrong default value for channelCountMode of a ChannelSplitterNode.
 *
 * Bug #30: Safari up to version 13.1 allowed to set the channelCountMode of a ChannelSplitterNode to 'clamped-max' and 'max'.
 *
 * Bug #31: Safari up to version 13.1 exposed the wrong default value for channelInterpretation of a ChannelSplitterNode.
 *
 * Bug #32: Safari up to version 13.1 allowed to set the channelInterpretation of a ChannelSplitterNode to 'speakers'.
 *
 * Bug #36: Safari up to version 13.1 did not support getFloatTimeDomainData() of an AnalyserNode.
 *
 * Bug #38: Safari up to version 13.1 had no getOutputTimestamp() implementation of an AudioContext.
 *
 * Bug #39: Safari up to version 13.1 did not expose the baseLatency property of an AudioContext.
 *
 * Bug #41: Safari up to version 13.1 threw a SyntaxError when trying to connect an AudioNode with an AudioNode of another AudioContext.
 *
 * Bug #45: Safari up to version 13.1 threw no error when scheduling an exponential ramp to 0.
 *
 * Bug #46: Safari up to version 13.1 not allowed to create an OfflineAudioContext with an OfflineAudioContextOptions object.
 *
 * Bug #47: Safari up to version 13.1 initialized the maxChannelCount property of an AudioDestinationNode of an OfflineAudioContext with 0.
 *
 * Bug #48: Safari up to version 13.1 required at least one connected AudioNode to render an OfflineAudioContext.
 *
 * Bug #49: Safari up to version 13.1 transitioned directly from suspended to closed when rendering an OfflineAudioContext.
 *
 * Bug #56: Safari up to version 13.1 rejected the promise returned by resume() and suspend() without any error.
 *
 * Bug #62: Safari up to version 13.1 had no ConstantSourceNode implementation.
 *
 * Bug #68: Safari up to version 13.1 did not throw an error if the parameters of getFrequencyResponse() of a BiquadFilterNode differed in
 * their length.
 *
 * Bug #69: Safari up to version 13.1 threw an error when calling start() of an AudioBufferSourceNode more than once.
 *
 * Bug #73: Safari up to version 13.1 did not expose the correct values for maxValue and minValue of the playbackRate AudioParam of an
 * AudioBufferSourceNode.
 *
 * Bug #74: Safari up to version 13.1 did not expose the correct values for maxValue and minValue of the gain AudioParam of an GainNode.
 *
 * Bug #76: Safari up to version 13.1 did not expose the correct values for maxValue and minValue of the frequency AudioParam of an
 * OscillatorNode.
 *
 * Bug #80: Safari up to version 13.1 did not expose the correct values for maxValue and minValue of the Q AudioParam of a BiquadFilterNode.
 *
 * Bug #83: Safari up to version 13.1 initialized the channelCountMode property of an AudioDestinationNode of an OfflineAudioContext with
 * 'explicit'.
 *
 * Bug #94: Safari up to version 13.1 exposed a close() method on an OfflineAudioContext.
 *
 * Bug #95: Safari up to version 13.1 played no looped AudioBuffer with only a single sample.
 *
 * Bug #96: Safari up to version 13.1 exposed the wrong default value for channelCount of a ChannelSplitterNode.
 *
 * Bug #97: Safari up to version 13.1 allowed to change the channelCount of a ChannelSplitterNode.
 *
 * Bug #99: Safari up to version 13.1 threw no error when creating an AudioBuffer without any channels.
 *
 * Bug #100: Safari up to version 13.1 threw a SyntaxError when calling getChannelData() with an out-of-bounds value.
 *
 * Bug #102: Safari up to version 13.1 threw no error when the curve had less than two samples.
 *
 * Bug #103: Safari up to version 13.1 not allowed to set the curve to null.
 *
 * Bug #105: Safari up to version 13.1 had no StereoPannerNode implementation.
 *
 * Bug #108: Safari up to version 13.1 allowed to set the channelCount of a DynamicsCompressorNode to a value greater than 2.
 *
 * Bug #109: Safari up to version 13.1 allowed to set the channelCountMode of a DynamicsCompressorNode to 'max'.
 *
 * Bug #111: Safari up to version 13.1 exposed an AudioParam instead of a number as the value of the reduction property of a
 * DynamicsCompressorNode.
 *
 * Bug #113: Safari up to version 13.1 allowed to set the channelCount of a ConvolverNode to a value larger than 2.
 *
 * Bug #114: Safari up to version 13.1 allowed to set the channelCountMode of a ConvolverNode to 'max'.
 *
 * Bug #118: Safari up to version 13.1 threw no error if maxDecibels was assigned to a value less than minDecibels or minDecibels was
 * assigned to a value greater than maxDecibels.
 *
 * Bug #119: Safari up to version 13.1 incorrectly mapped the curve values of a WaveShaperNode.
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
 * Bug #132: Safari up to version 13.1 initialized the channelCount property of an AudioDestinationNode of an OfflineAudioContext with 2.
 *
 * Bug #140: Safari up to version 13.1 did not support creating an AudioBuffer with a sampleRate below 22050 Hz.
 *
 * Bug #141: Safari up to version 13.1 not allowed to create an OfflineAudioContext with a sampleRate less than 44100 Hz.
 *
 * Bug #142: Safari up to version 13.1 not allowed to create an OfflineAudioContext with more than 10 channels.
 *
 * Bug #143, #144 & #146: Safari up to version 13.1 threw a SyntaxError when numberOfChannels, length or sampleRate were invalid when
 * creating an OfflineAudioContext.
 *
 * Bug #147: Safari up to version 13.1 did not support to connect a signal to the playbackRate AudioParam of an AudioBufferSourceNode.
 *
 * Bug #149: Safari up to version 13.1 had no detune AudioParam implementation of an AudioBufferSourceNode.
 *
 * Bug #150: Safari up to version 13.1 did not support setting the sampleRate.
 *
 * Bug #151: Safari up to version 13.1 did not use an audio track as input anymore if it got removed from a MediaStream after using it to
 * create a MediaStreamAudioSourceNode.
 *
 * Bug #152: Safari up to version 13.1 interpolated the values of the curve incorrectly when calling setValueCurveAtTime() of an AudioParam.
 *
 * Bug #153: Safari up to version 13.1 exposed a name property on each AudioParam.
 *
 * Bug #154: Safari up to version 13.1 threw an error when calling start() of an AudioBufferSourceNode with an offset that was equal or
 * greater than the duration of the buffer.
 *
 * Bug #155: Safari up to version 13.1 ignored the offset when calling start() of an AudioBufferSourceNode with it would have caused the
 * buffer to be not be played at all.
 *
 * Bug #160: Safari up to version 13.1 exposed a startRendering() method on an AudioContext.
 *
 * Bug #162: Safari up to version 13.1 threw an error when stop() was called on an AudioBufferSourceNode which had no buffer assigned to it.
 *
 * Bug #165: Safari up to version 13.1 outputed silence if a MediaStreamAudioSourceNode was disconnected for about two seconds.
 *
 * Bug #169: Safari up to version 13.1 threw an error on each attempt to change the channelCount of an AudioDestinationNode.
 *
 * Bug #171: Safari up to version 13.1 allowed to create a MediaElementAudioSourceNode with an OfflineAudioContext.
 *
 * Bug #172: Safari up to version 13.1 allowed to create a MediaStreamAudioSourceNode with an OfflineAudioContext.
 *
 * Bug #173: Safari up to version 13.1 allowed to create a MediaStreamAudioDestinationNode with an OfflineAudioContext.
 *
 * Bug #174: Safari up to version 13.1 exposed the wrong value for numberOfOutputs of a MediaStreamAudioDestinationNode.
 *
 * Bug #180: Safari up to version 13.1 not allowed to use ordinary arrays as parameters of createPeriodicWave().
 *
 * Bug #183: Safari up to version 13.1 only accepted a Float32Array as the values parameter for the setValueCurveAtTime() function of an
 * AudioParam.
 *
 * Bug #187: Safari up to version 13.1 threw no error when scheduling an exponential ramp with negative endTime.
 *
 * Bug #199: Safari up to version 13.1 threw an InvalidStateError when calling suspend() on an OfflineAudioContext.
 *
 * Bug #200: Safari up to version 13.1 only had a prefixed implementation of an AudioContext and an OfflineAudioContext.
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
