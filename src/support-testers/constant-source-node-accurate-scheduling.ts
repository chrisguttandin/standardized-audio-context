import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

export class ConstantSourceNodeAccurateSchedulingSupportTester {

    public test (audioContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext) {
        // @todo TypeScript doesn't know yet about createConstantSource().
        const constantSourceNode = (<any> audioContext).createConstantSource();

        /*
         * @todo This is using bug #67 to detect bug #70. That works because both bugs are unique to the implementation of Firefox right
         * now, but it could probably be done in a better way.
         */
        return (constantSourceNode.channelCount !== 1);
    }

}

export const CONSTANT_SOURCE_NODE_ACCURATE_SCHEDULING_SUPPORT_TESTER_PROVIDER = {
    deps: [ ],
    provide: ConstantSourceNodeAccurateSchedulingSupportTester
};
