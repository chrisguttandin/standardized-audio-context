import { TNativeContext } from '../types';

export const testConstantSourceNodeAccurateSchedulingSupport = (nativeContext: TNativeContext): boolean => {
    // @todo TypeScript doesn't know yet about createConstantSource().
    const constantSourceNode = (<any> nativeContext).createConstantSource();

    /*
     * @todo This is using bug #67 to detect bug #70. That works because both bugs are unique to the implementation of Firefox right
     * now, but it could probably be done in a better way.
     */
    return (constantSourceNode.channelCount !== 1);
};
