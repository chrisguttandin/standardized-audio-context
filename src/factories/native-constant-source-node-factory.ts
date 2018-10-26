import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { cacheTestResult } from '../helpers/cache-test-result';
import { INativeConstantSourceNode } from '../interfaces';
import { TNativeConstantSourceNodeFactoryFactory } from '../types';
import {
    wrapAudioScheduledSourceNodeStartMethodNegativeParameters
} from '../wrappers/audio-scheduled-source-node-start-method-negative-parameters';
import {
    wrapAudioScheduledSourceNodeStopMethodNegativeParameters
} from '../wrappers/audio-scheduled-source-node-stop-method-negative-parameters';

export const createNativeConstantSourceNodeFactory: TNativeConstantSourceNodeFactoryFactory = (
    createNativeAudioNode,
    createNativeConstantSourceNodeFaker,
    testAudioScheduledSourceNodeStartMethodNegativeParametersSupport,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport
) => {
    return (nativeContext, options) => {
        // Bug #62: Edge & Safari do not support ConstantSourceNodes.
        // @todo TypeScript doesn't know yet about createConstantSource().
        if ((<any> nativeContext).createConstantSource === undefined) {
            return createNativeConstantSourceNodeFaker(nativeContext, options);
        }

        const nativeConstantSourceNode = createNativeAudioNode(nativeContext, (ntvCntxt) => {
            return <INativeConstantSourceNode> (<any> ntvCntxt).createConstantSource();
        });

        assignNativeAudioNodeOptions(nativeConstantSourceNode, options);

        if (options.offset !== nativeConstantSourceNode.offset.value) {
            nativeConstantSourceNode.offset.value = options.offset;
        }

        // Bug #44: Only Chrome & Opera throw a RangeError yet.
        if (!cacheTestResult(
            testAudioScheduledSourceNodeStartMethodNegativeParametersSupport,
            () => testAudioScheduledSourceNodeStartMethodNegativeParametersSupport(nativeContext)
        )) {
            wrapAudioScheduledSourceNodeStartMethodNegativeParameters(nativeConstantSourceNode);
        }

        // Bug #44: No browser does throw a RangeError yet.
        if (!cacheTestResult(
            testAudioScheduledSourceNodeStopMethodNegativeParametersSupport,
            () => testAudioScheduledSourceNodeStopMethodNegativeParametersSupport(nativeContext)
        )) {
            wrapAudioScheduledSourceNodeStopMethodNegativeParameters(nativeConstantSourceNode);
        }

        return nativeConstantSourceNode;
    };
};
