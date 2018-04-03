import { TConstantSourceNodeRendererFactory } from './constant-source-node-renderer-factory';
import { TNativeConstantSourceNodeFactory } from './native-constant-source-node-factory';

export type TConstantSourceNodeRendererFactoryFactory = (
    createNativeConstantSourceNode: TNativeConstantSourceNodeFactory
) => TConstantSourceNodeRendererFactory;
