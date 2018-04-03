import { TBiquadFilterNodeRendererFactory } from './biquad-filter-node-renderer-factory';
import { TNativeBiquadFilterNodeFactory } from './native-biquad-filter-node-factory';

export type TBiquadFilterNodeRendererFactoryFactory = (
    createNativeBiquadFilterNode: TNativeBiquadFilterNodeFactory
) => TBiquadFilterNodeRendererFactory;
