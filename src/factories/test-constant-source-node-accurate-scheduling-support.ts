import { TTestConstantSourceNodeAccurateSchedulingSupportFactory } from '../types';

export const createTestConstantSourceNodeAccurateSchedulingSupport: TTestConstantSourceNodeAccurateSchedulingSupportFactory = (
    createNativeAudioNode,
    nativeOfflineAudioContextConstructor
) => {
    return () => {
        if (nativeOfflineAudioContextConstructor === null) {
            return false;
        }

        const nativeOfflineAudioContext = new nativeOfflineAudioContextConstructor(1, 1, 44100);

        // Bug #62: Edge & Safari do not support ConstantSourceNodes.
        if (nativeOfflineAudioContext.createConstantSource === undefined) {
            return true;
        }

        const nativeConstantSourceNode = createNativeAudioNode(nativeOfflineAudioContext, (ntvCntxt) => ntvCntxt.createConstantSource());

        /*
         * @todo This is using bug #75 to detect bug #70. That works because both bugs were unique to
         * the implementation of Firefox right now, but it could probably be done in a better way.
         */
        return nativeConstantSourceNode.offset.maxValue !== Number.POSITIVE_INFINITY;
    };
};
