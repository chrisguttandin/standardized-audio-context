import { IConstantSourceNodeRendererConstructor } from '../interfaces';
import { TNativeConstantSourceNodeFactory } from './native-constant-source-node-factory';

export type TConstantSourceNodeRendererConstructorFactory = (
    createNativeConstantSourceNode: TNativeConstantSourceNodeFactory
) => IConstantSourceNodeRendererConstructor;
