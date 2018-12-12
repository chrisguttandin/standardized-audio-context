import { TDelayNodeRendererFactory } from './delay-node-renderer-factory';
import { TNativeDelayNodeFactory } from './native-delay-node-factory';

export type TDelayNodeRendererFactoryFactory = (createNativeDelayNode: TNativeDelayNodeFactory) => TDelayNodeRendererFactory;
