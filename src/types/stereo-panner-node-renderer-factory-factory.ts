import { TNativeStereoPannerNodeFactory } from './native-stereo-panner-node-factory';
import { TStereoPannerNodeRendererFactory } from './stereo-panner-node-renderer-factory';

export type TStereoPannerNodeRendererFactoryFactory = (
    createNativeStereoPannerNode: TNativeStereoPannerNodeFactory
) => TStereoPannerNodeRendererFactory;
