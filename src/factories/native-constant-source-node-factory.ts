import { assignNativeAudioNodeAudioParamValue } from '../helpers/assign-native-audio-node-audio-param-value';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { wrapAudioScheduledSourceNodeStartMethodNegativeParameters } from '../helpers/wrap-audio-scheduled-source-node-start-method-negative-parameters';
import { wrapAudioScheduledSourceNodeStopMethodNegativeParameters } from '../helpers/wrap-audio-scheduled-source-node-stop-method-negative-parameters';
import { TNativeConstantSourceNodeFactoryFactory } from '../types';

export const createNativeConstantSourceNodeFactory: TNativeConstantSourceNodeFactoryFactory = (
    addSilentConnection,
    cacheTestResult,
    createNativeAudioNode,
    createNativeConstantSourceNodeFaker,
    testAudioScheduledSourceNodeStartMethodNegativeParametersSupport,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport
) => {
    return (nativeContext, options) => {
        // Bug #62: Edge & Safari do not support ConstantSourceNodes.
        if (nativeContext.createConstantSource === undefined) {
            return createNativeConstantSourceNodeFaker(nativeContext, options);
        }

        const nativeConstantSourceNode = createNativeAudioNode(nativeContext, (ntvCntxt) => {
            return ntvCntxt.createConstantSource();
        });

        assignNativeAudioNodeOptions(nativeConstantSourceNode, options);

        assignNativeAudioNodeAudioParamValue(nativeConstantSourceNode, options, 'offset');

        // Bug #44: Only Chrome, Firefox & Opera throw a RangeError yet.
        if (
            !cacheTestResult(testAudioScheduledSourceNodeStartMethodNegativeParametersSupport, () =>
                testAudioScheduledSourceNodeStartMethodNegativeParametersSupport(nativeContext)
            )
        ) {
            wrapAudioScheduledSourceNodeStartMethodNegativeParameters(nativeConstantSourceNode);
        }

        // Bug #44: Only Firefox does not throw a RangeError yet.
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
