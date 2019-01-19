import { TNativePannerNodeFactory } from './native-panner-node-factory';
import { TPannerNodeRendererFactory } from './panner-node-renderer-factory';

export type TPannerNodeRendererFactoryFactory = (createNativePannerNode: TNativePannerNodeFactory) => TPannerNodeRendererFactory;
