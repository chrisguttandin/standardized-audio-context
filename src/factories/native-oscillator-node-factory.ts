import { assignNativeAudioNodeAudioParamValue } from '../helpers/assign-native-audio-node-audio-param-value';
import { assignNativeAudioNodeOption } from '../helpers/assign-native-audio-node-option';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { wrapAudioScheduledSourceNodeStopMethodNegativeParameters } from '../helpers/wrap-audio-scheduled-source-node-stop-method-negative-parameters';
import { TNativeOscillatorNodeFactoryFactory } from '../types';

export const createNativeOscillatorNodeFactory: TNativeOscillatorNodeFactoryFactory = (
    addSilentConnection,
    cacheTestResult,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport
) => {
    return (nativeContext, options) => {
        const nativeOscillatorNode = nativeContext.createOscillator();

        assignNativeAudioNodeOptions(nativeOscillatorNode, options);

        assignNativeAudioNodeAudioParamValue(nativeOscillatorNode, options, 'detune');
        assignNativeAudioNodeAudioParamValue(nativeOscillatorNode, options, 'frequency');

        if (options.periodicWave !== undefined) {
            nativeOscillatorNode.setPeriodicWave(options.periodicWave);
        } else {
            assignNativeAudioNodeOption(nativeOscillatorNode, options, 'type');
        }

        // Bug #44: Only Firefox throws a RangeError.
        if (
            !cacheTestResult(testAudioScheduledSourceNodeStopMethodNegativeParametersSupport, () =>
                testAudioScheduledSourceNodeStopMethodNegativeParametersSupport(nativeContext)
            )
        ) {
            wrapAudioScheduledSourceNodeStopMethodNegativeParameters(nativeOscillatorNode);
        }

        // Bug #175: Safari will not fire an ended event if the OscillatorNode is unconnected.
        addSilentConnection(nativeContext, nativeOscillatorNode);

        return nativeOscillatorNode;
    };
};
