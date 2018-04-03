import { TGainNodeRendererFactory } from './gain-node-renderer-factory';
import { TNativeGainNodeFactory } from './native-gain-node-factory';

export type TGainNodeRendererFactoryFactory = (createNativeGainNode: TNativeGainNodeFactory) => TGainNodeRendererFactory;
