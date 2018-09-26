import { TNativeWaveShaperNodeFactory } from './native-wave-shaper-node-factory';
import { TWaveShaperNodeRendererFactory } from './wave-shaper-node-renderer-factory';

export type TWaveShaperNodeRendererFactoryFactory = (
    createNativeWaveShaperNode: TNativeWaveShaperNodeFactory
) => TWaveShaperNodeRendererFactory;
