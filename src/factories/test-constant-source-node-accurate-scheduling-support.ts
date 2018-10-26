import { INativeConstantSourceNode } from '../interfaces';
import { TTestConstantSourceNodeAccurateSchedulingSupportFactory } from '../types';

export const createTestConstantSourceNodeAccurateSchedulingSupport:
    TTestConstantSourceNodeAccurateSchedulingSupportFactory =
(
    createNativeAudioNode,
    nativeOfflineAudioContextConstructor
) => {
    return () => {
        if (nativeOfflineAudioContextConstructor === null) {
            return false;
        }

        const nativeOfflineAudioContext = new nativeOfflineAudioContextConstructor(1, 1, 44100);
        // @todo TypeScript doesn't know yet about createConstantSource().
        const nativeConstantSourceNode = createNativeAudioNode(nativeOfflineAudioContext, (ntvCntxt) => {
            return <INativeConstantSourceNode> (<any> ntvCntxt).createConstantSource();
        });

        /*
         * @todo This is using bug #75 to detect bug #70. That works because both bugs were unique to
         * the implementation of Firefox right now, but it could probably be done in a better way.
         */
        return (nativeConstantSourceNode.offset.maxValue !== Number.POSITIVE_INFINITY);
    };
};
