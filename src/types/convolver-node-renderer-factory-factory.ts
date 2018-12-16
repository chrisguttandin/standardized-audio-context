import { TConvolverNodeRendererFactory } from './convolver-node-renderer-factory';
import { TNativeConvolverNodeFactory } from './native-convolver-node-factory';

export type TConvolverNodeRendererFactoryFactory = (
    createNativeConvolverNode: TNativeConvolverNodeFactory
) => TConvolverNodeRendererFactory;
