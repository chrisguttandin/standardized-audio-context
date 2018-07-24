import { INativeConstantSourceNode } from '../interfaces';
import { TNativeContext } from './native-context';

export type TWrapConstantSourceNodeAccurateSchedulingFunction = (
    nativeConstantSourceNode: INativeConstantSourceNode,
    nativeContext: TNativeContext
) => void;
