import { TDynamicsCompressorNodeRendererFactory } from './dynamics-compressor-node-renderer-factory';
import { TNativeDynamicsCompressorNodeFactory } from './native-dynamics-compressor-node-factory';

export type TDynamicsCompressorNodeRendererFactoryFactory = (
    createNativeDynamicsCompressorNode: TNativeDynamicsCompressorNodeFactory
) => TDynamicsCompressorNodeRendererFactory;
