import { connectAudioParam } from '../helpers/connect-audio-param';
import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IAudioBufferSourceNode, IAudioBufferSourceOptions, IMinimalOfflineAudioContext } from '../interfaces';
import { TAudioBufferSourceNodeRendererFactoryFactory, TNativeAudioBufferSourceNode, TNativeOfflineAudioContext } from '../types';

export const createAudioBufferSourceNodeRendererFactory: TAudioBufferSourceNodeRendererFactoryFactory = (
    createNativeAudioBufferSourceNode
) => {
    return <T extends IMinimalOfflineAudioContext>() => {
        let nativeAudioBufferSourceNodePromise: null | Promise<TNativeAudioBufferSourceNode> = null;
        let start: null | [ number, number ] | [ number, number, number ] = null;
        let stop: null | number = null;

        const createAudioBufferSourceNode = async (
            proxy: IAudioBufferSourceNode<T>,
            nativeOfflineAudioContext: TNativeOfflineAudioContext
        ) => {
            let nativeAudioBufferSourceNode = getNativeAudioNode<T, TNativeAudioBufferSourceNode>(proxy);

            /*
             * If the initially used nativeAudioBufferSourceNode was not constructed on the same OfflineAudioContext it needs to be created
             * again.
             */
            if (!isOwnedByContext(nativeAudioBufferSourceNode, nativeOfflineAudioContext)) {
                const options: IAudioBufferSourceOptions = {
                    buffer: nativeAudioBufferSourceNode.buffer,
                    channelCount: nativeAudioBufferSourceNode.channelCount,
                    channelCountMode: nativeAudioBufferSourceNode.channelCountMode,
                    channelInterpretation: nativeAudioBufferSourceNode.channelInterpretation,
                    // Bug #149: Safari does not yet support the detune AudioParam.
                    loop: nativeAudioBufferSourceNode.loop,
                    loopEnd: nativeAudioBufferSourceNode.loopEnd,
                    loopStart: nativeAudioBufferSourceNode.loopStart,
                    playbackRate: nativeAudioBufferSourceNode.playbackRate.value
                };

                nativeAudioBufferSourceNode = createNativeAudioBufferSourceNode(nativeOfflineAudioContext, options);

                if (start !== null) {
                    nativeAudioBufferSourceNode.start(...start);
                }

                if (stop !== null) {
                    nativeAudioBufferSourceNode.stop(stop);
                }

                // Bug #149: Safari does not yet support the detune AudioParam.
                await renderAutomation(
                    proxy.context,
                    nativeOfflineAudioContext,
                    proxy.playbackRate,
                    nativeAudioBufferSourceNode.playbackRate
                );
            } else {
                // Bug #149: Safari does not yet support the detune AudioParam.
                await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.playbackRate);
            }

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeAudioBufferSourceNode);

            return nativeAudioBufferSourceNode;
        };

        return {
            set start (value: [ number, number ] | [ number, number, number ]) {
                start = value;
            },
            set stop (value: number) {
                stop = value;
            },
            render (
                proxy: IAudioBufferSourceNode<T>,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeAudioBufferSourceNode> {
                if (nativeAudioBufferSourceNodePromise === null) {
                    nativeAudioBufferSourceNodePromise = createAudioBufferSourceNode(proxy, nativeOfflineAudioContext);
                }

                return nativeAudioBufferSourceNodePromise;
            }
        };
    };
};
