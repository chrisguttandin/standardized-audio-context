import { assignNativeAudioNodeAudioParamValue } from '../helpers/assign-native-audio-node-audio-param-value';
import { assignNativeAudioNodeOption } from '../helpers/assign-native-audio-node-option';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { cacheTestResult } from '../helpers/cache-test-result';
import { TNativeOscillatorNodeFactoryFactory } from '../types';
import {
    wrapAudioScheduledSourceNodeStartMethodNegativeParameters
} from '../wrappers/audio-scheduled-source-node-start-method-negative-parameters';
import {
    wrapAudioScheduledSourceNodeStopMethodNegativeParameters
} from '../wrappers/audio-scheduled-source-node-stop-method-negative-parameters';

export const createNativeOscillatorNodeFactory: TNativeOscillatorNodeFactoryFactory = (
    createNativeAudioNode,
    testAudioScheduledSourceNodeStartMethodNegativeParametersSupport,
    testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport,
    wrapAudioScheduledSourceNodeStopMethodConsecutiveCalls
) => {
    return (nativeContext, options) => {
        const nativeOscillatorNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createOscillator());

        assignNativeAudioNodeOptions(nativeOscillatorNode, options);

        assignNativeAudioNodeAudioParamValue(nativeOscillatorNode, options, 'detune');
        assignNativeAudioNodeAudioParamValue(nativeOscillatorNode, options, 'frequency');

        if (options.periodicWave !== undefined) {
            nativeOscillatorNode.setPeriodicWave(options.periodicWave);
        } else {
            assignNativeAudioNodeOption(nativeOscillatorNode, options, 'type');
        }

        // Bug #44: Only Chrome & Opera throw a RangeError yet.
        if (!cacheTestResult(
            testAudioScheduledSourceNodeStartMethodNegativeParametersSupport,
            () => testAudioScheduledSourceNodeStartMethodNegativeParametersSupport(nativeContext)
        )) {
            wrapAudioScheduledSourceNodeStartMethodNegativeParameters(nativeOscillatorNode);
        }

        // Bug #19: Safari does not ignore calls to stop() of an already stopped AudioBufferSourceNode.
        if (!cacheTestResult(
            testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport,
            () => testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport(nativeContext)
        )) {
            wrapAudioScheduledSourceNodeStopMethodConsecutiveCalls(nativeOscillatorNode, nativeContext);
        }

        // Bug #44: No browser does throw a RangeError yet.
        if (!cacheTestResult(
            testAudioScheduledSourceNodeStopMethodNegativeParametersSupport,
            () => testAudioScheduledSourceNodeStopMethodNegativeParametersSupport(nativeContext)
        )) {
            wrapAudioScheduledSourceNodeStopMethodNegativeParameters(nativeOscillatorNode);
        }

        return nativeOscillatorNode;
    };
};
