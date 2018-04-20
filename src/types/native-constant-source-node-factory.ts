import { IConstantSourceOptions, INativeConstantSourceNode } from '../interfaces';
import { TNativeContext } from './native-context';

export type TNativeConstantSourceNodeFactory = (
    nativeContext: TNativeContext,
    options: IConstantSourceOptions
) => INativeConstantSourceNode;
