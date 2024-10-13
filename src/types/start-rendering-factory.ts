import { TAudioBufferStore } from './audio-buffer-store';
import { TGetAudioNodeRendererFunction } from './get-audio-node-renderer-function';
import { TGetUnrenderedAudioWorkletNodesFunction } from './get-unrendered-audio-worklet-nodes-function';
import { TStartRenderingFunction } from './start-rendering-function';

export type TStartRenderingFactory = (
    audioBufferStore: TAudioBufferStore,
    getAudioNodeRenderer: TGetAudioNodeRendererFunction,
    getUnrenderedAudioWorkletNodes: TGetUnrenderedAudioWorkletNodesFunction
) => TStartRenderingFunction;
