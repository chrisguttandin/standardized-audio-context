import { TNativeOscillatorNodeFactory } from './native-oscillator-node-factory';
import { TOscillatorNodeRendererFactory } from './oscillator-node-renderer-factory';

export type TOscillatorNodeRendererFactoryFactory = (
    createNativeOscillatorNode: TNativeOscillatorNodeFactory
) => TOscillatorNodeRendererFactory;
