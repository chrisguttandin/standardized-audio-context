import { assignNativeAudioNodeAudioParamValue } from '../helpers/assign-native-audio-node-audio-param-value';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { wrapAudioScheduledSourceNodeStopMethodNegativeParameters } from '../helpers/wrap-audio-scheduled-source-node-stop-method-negative-parameters';
import { TNativeConstantSourceNodeFactoryFactory } from '../types';

export const createNativeConstantSourceNodeFactory: TNativeConstantSourceNodeFactoryFactory = (
    addSilentConnection,
    cacheTestResult,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport
) => {
    return (nativeContext, options) => {
        const nativeConstantSourceNode = nativeContext.createConstantSource();

        assignNativeAudioNodeOptions(nativeConstantSourceNode, options);

        assignNativeAudioNodeAudioParamValue(nativeConstantSourceNode, options, 'offset');

        // Bug #44: Only Firefox throws a RangeError.
        if (
            !cacheTestResult(testAudioScheduledSourceNodeStopMethodNegativeParametersSupport, () =>
                testAudioScheduledSourceNodeStopMethodNegativeParametersSupport(nativeContext)
            )
        ) {
            wrapAudioScheduledSourceNodeStopMethodNegativeParameters(nativeConstantSourceNode);
        }

        // Bug #175: Safari will not fire an ended event if the ConstantSourceNode is unconnected.
        addSilentConnection(nativeContext, nativeConstantSourceNode);

        return nativeConstantSourceNode;
    };
};
