import { TNativeConstantSourceNodeFactory } from './native-constant-source-node-factory';
import { TNativeConstantSourceNodeFakerFactory } from './native-constant-source-node-faker-factory';

export type TNativeConstantSourceNodeFactoryFactory = (
    createNativeConstantSourceNodeFaker: TNativeConstantSourceNodeFakerFactory
) => TNativeConstantSourceNodeFactory;
