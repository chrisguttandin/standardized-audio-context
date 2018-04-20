import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IAudioBufferSourceNode, IAudioBufferSourceOptions } from '../interfaces';
import { TAudioBufferSourceNodeRendererFactoryFactory, TNativeAudioBufferSourceNode, TNativeOfflineAudioContext } from '../types';

export const createAudioBufferSourceNodeRendererFactory: TAudioBufferSourceNodeRendererFactoryFactory = (
    createNativeAudioBufferSourceNode
) => {
    return () => {
        let nativeNode: null | TNativeAudioBufferSourceNode = null;
        let start: null | [ number, number ] | [ number, number, number ] = null;
        let stop: null | number = null;

        return {
            set start (value: [ number, number ] | [ number, number, number ]) {
                start = value;
            },
            set stop (value: number) {
                stop = value;
            },
            render: async (
                proxy: IAudioBufferSourceNode,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeAudioBufferSourceNode> => {
                if (nativeNode !== null) {
                    return nativeNode;
                }

                nativeNode = <TNativeAudioBufferSourceNode> getNativeNode(proxy);

                // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
                if (!isOwnedByContext(nativeNode, nativeOfflineAudioContext)) {
                    const options: IAudioBufferSourceOptions = {
                        buffer: nativeNode.buffer,
                        channelCount: nativeNode.channelCount,
                        channelCountMode: nativeNode.channelCountMode,
                        channelInterpretation: nativeNode.channelInterpretation,
                        detune: 0, // @todo nativeNode.detune.value,
                        loop: nativeNode.loop,
                        loopEnd: nativeNode.loopEnd,
                        loopStart: nativeNode.loopStart,
                        playbackRate: nativeNode.playbackRate.value
                    };

                    nativeNode = createNativeAudioBufferSourceNode(nativeOfflineAudioContext, options);

                    if (start !== null) {
                        nativeNode.start(...start);
                    }

                    if (stop !== null) {
                        nativeNode.stop(stop);
                    }
                }

                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeNode);

                return nativeNode;
            }
        };
    };
};
