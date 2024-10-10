import { assignNativeAudioNodeAudioParamValue } from '../helpers/assign-native-audio-node-audio-param-value';
import { assignNativeAudioNodeOption } from '../helpers/assign-native-audio-node-option';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { wrapAudioScheduledSourceNodeStopMethodNegativeParameters } from '../helpers/wrap-audio-scheduled-source-node-stop-method-negative-parameters';
import { TNativeAudioBufferSourceNodeFactoryFactory } from '../types';

export const createNativeAudioBufferSourceNodeFactory: TNativeAudioBufferSourceNodeFactoryFactory = (
    addSilentConnection,
    cacheTestResult,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport
) => {
    return (nativeContext, options) => {
        const nativeAudioBufferSourceNode = nativeContext.createBufferSource();

        assignNativeAudioNodeOptions(nativeAudioBufferSourceNode, options);

        assignNativeAudioNodeAudioParamValue(nativeAudioBufferSourceNode, options, 'detune');
        assignNativeAudioNodeAudioParamValue(nativeAudioBufferSourceNode, options, 'playbackRate');

        assignNativeAudioNodeOption(nativeAudioBufferSourceNode, options, 'buffer');
        assignNativeAudioNodeOption(nativeAudioBufferSourceNode, options, 'loop');
        assignNativeAudioNodeOption(nativeAudioBufferSourceNode, options, 'loopEnd');
        assignNativeAudioNodeOption(nativeAudioBufferSourceNode, options, 'loopStart');

        // Bug #44: Only Firefox throws a RangeError.
        if (
            !cacheTestResult(testAudioScheduledSourceNodeStopMethodNegativeParametersSupport, () =>
                testAudioScheduledSourceNodeStopMethodNegativeParametersSupport(nativeContext)
            )
        ) {
            wrapAudioScheduledSourceNodeStopMethodNegativeParameters(nativeAudioBufferSourceNode);
        }

        // Bug #175: Safari will not fire an ended event if the AudioBufferSourceNode is unconnected.
        addSilentConnection(nativeContext, nativeAudioBufferSourceNode);

        return nativeAudioBufferSourceNode;
    };
};
