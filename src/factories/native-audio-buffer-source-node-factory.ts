import { assignNativeAudioNodeAudioParamValue } from '../helpers/assign-native-audio-node-audio-param-value';
import { assignNativeAudioNodeOption } from '../helpers/assign-native-audio-node-option';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { wrapAudioScheduledSourceNodeStartMethodNegativeParameters } from '../helpers/wrap-audio-scheduled-source-node-start-method-negative-parameters';
import { wrapAudioScheduledSourceNodeStopMethodNegativeParameters } from '../helpers/wrap-audio-scheduled-source-node-stop-method-negative-parameters';
import { TNativeAudioBufferSourceNodeFactoryFactory } from '../types';

export const createNativeAudioBufferSourceNodeFactory: TNativeAudioBufferSourceNodeFactoryFactory = (
    addSilentConnection,
    cacheTestResult,
    testAudioBufferSourceNodeStartMethodOffsetClampingSupport,
    testAudioScheduledSourceNodeStartMethodNegativeParametersSupport,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport,
    wrapAudioBufferSourceNodeStartMethodOffsetClampling
) => {
    return (nativeContext, options) => {
        const nativeAudioBufferSourceNode = nativeContext.createBufferSource();

        assignNativeAudioNodeOptions(nativeAudioBufferSourceNode, options);

        assignNativeAudioNodeAudioParamValue(nativeAudioBufferSourceNode, options, 'playbackRate');

        assignNativeAudioNodeOption(nativeAudioBufferSourceNode, options, 'buffer');

        // Bug #149: Safari does not yet support the detune AudioParam.

        assignNativeAudioNodeOption(nativeAudioBufferSourceNode, options, 'loop');
        assignNativeAudioNodeOption(nativeAudioBufferSourceNode, options, 'loopEnd');
        assignNativeAudioNodeOption(nativeAudioBufferSourceNode, options, 'loopStart');

        // Bug #154 & #155: Safari does not handle offsets which are equal to or greater than the duration of the buffer.
        if (
            !cacheTestResult(testAudioBufferSourceNodeStartMethodOffsetClampingSupport, () =>
                testAudioBufferSourceNodeStartMethodOffsetClampingSupport(nativeContext)
            )
        ) {
            wrapAudioBufferSourceNodeStartMethodOffsetClampling(nativeAudioBufferSourceNode);
        }

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
