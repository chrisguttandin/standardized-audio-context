import { assignNativeAudioNodeAudioParamValue } from '../helpers/assign-native-audio-node-audio-param-value';
import { assignNativeAudioNodeOption } from '../helpers/assign-native-audio-node-option';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { wrapAudioScheduledSourceNodeStartMethodNegativeParameters } from '../helpers/wrap-audio-scheduled-source-node-start-method-negative-parameters';
import { wrapAudioScheduledSourceNodeStopMethodNegativeParameters } from '../helpers/wrap-audio-scheduled-source-node-stop-method-negative-parameters';
import { TNativeAudioBufferSourceNodeFactoryFactory } from '../types';

export const createNativeAudioBufferSourceNodeFactory: TNativeAudioBufferSourceNodeFactoryFactory = (
    addSilentConnection,
    cacheTestResult,
    testAudioScheduledSourceNodeStartMethodNegativeParametersSupport,
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

        // Bug #44: Firefox does not throw a RangeError.
        if (
            !cacheTestResult(testAudioScheduledSourceNodeStartMethodNegativeParametersSupport, () =>
                testAudioScheduledSourceNodeStartMethodNegativeParametersSupport(nativeContext)
            )
        ) {
            wrapAudioScheduledSourceNodeStartMethodNegativeParameters(nativeAudioBufferSourceNode);
        }

        // Bug #44: Only Firefox does not throw a RangeError yet.
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
