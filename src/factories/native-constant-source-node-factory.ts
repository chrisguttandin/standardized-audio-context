import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { cacheTestResult } from '../helpers/cache-test-result';
import { INativeConstantSourceNode } from '../interfaces';
import {
    testAudioScheduledSourceNodeStartMethodNegativeParametersSupport
} from '../support-testers/audio-scheduled-source-node-start-method-negative-parameters';
import {
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport
} from '../support-testers/audio-scheduled-source-node-stop-method-negative-parameters';
import { testConstantSourceNodeAccurateSchedulingSupport } from '../support-testers/constant-source-node-accurate-scheduling';
import { TNativeConstantSourceNodeFactoryFactory } from '../types';
import {
    wrapAudioScheduledSourceNodeStartMethodNegativeParameters
} from '../wrappers/audio-scheduled-source-node-start-method-negative-parameters';
import {
    wrapAudioScheduledSourceNodeStopMethodNegativeParameters
} from '../wrappers/audio-scheduled-source-node-stop-method-negative-parameters';
import { wrapConstantSourceNodeAccurateScheduling } from '../wrappers/constant-source-node-accurate-scheduling';

export const createNativeConstantSourceNodeFactory: TNativeConstantSourceNodeFactoryFactory = (createNativeConstantSourceNodeFaker) => {
    return (nativeContext, options = { }) => {
        // Bug #62: Edge & Safari do not support ConstantSourceNodes.
        // @todo TypeScript doesn't know yet about createConstantSource().
        if ((<any> nativeContext).createConstantSource === undefined) {
            return createNativeConstantSourceNodeFaker(nativeContext, options);
        }

        const nativeNode = <INativeConstantSourceNode> (<any> nativeContext).createConstantSource();

        assignNativeAudioNodeOptions(nativeNode, options);

        // Bug #67: Firefox initializes the ConstantSourceNode with a channelCount of 1 instead of 2.
        if (nativeNode.channelCount === 1) {
            nativeNode.channelCount = 2;
        }

        if (options.offset !== undefined) {
            nativeNode.offset.value = options.offset;
        }

        // Bug #44: Only Chrome & Opera throw a RangeError yet.
        if (!cacheTestResult(
            testAudioScheduledSourceNodeStartMethodNegativeParametersSupport,
            () => testAudioScheduledSourceNodeStartMethodNegativeParametersSupport(nativeContext)
        )) {
            wrapAudioScheduledSourceNodeStartMethodNegativeParameters(nativeNode);
        }

        // Bug #44: No browser does throw a RangeError yet.
        if (!cacheTestResult(
            testAudioScheduledSourceNodeStopMethodNegativeParametersSupport,
            () => testAudioScheduledSourceNodeStopMethodNegativeParametersSupport(nativeContext)
        )) {
            wrapAudioScheduledSourceNodeStopMethodNegativeParameters(nativeNode);
        }

        // Bug #70: Firefox does not schedule ConstantSourceNodes accurately.
        if (!cacheTestResult(
            testConstantSourceNodeAccurateSchedulingSupport,
            () => testConstantSourceNodeAccurateSchedulingSupport(nativeContext)
        )) {
            wrapConstantSourceNodeAccurateScheduling(nativeNode, nativeContext);
        }

        return nativeNode;
    };
};
