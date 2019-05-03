import { isAudioBufferSourceNode } from '../guards/audio-buffer-source-node';
import { isAudioWorkletNode } from '../guards/audio-worklet-node';
import { isBiquadFilterNode } from '../guards/biquad-filter-node';
import { isConstantSourceNode } from '../guards/constant-source-node';
import { isGainNode } from '../guards/gain-node';
import { isOscillatorNode } from '../guards/oscillator-node';
import { isStereoPannerNode } from '../guards/stereo-panner-node';
import { IAudioGraph, IAudioNode, IMinimalBaseAudioContext } from '../interfaces';
import { disconnectAudioParamInputConnections } from './disconnect-audio-param-input-connections';

export const disconnectAudioNodeInputConnections = <T extends IMinimalBaseAudioContext>(
    audioGraph: IAudioGraph<T>,
    audioNode: IAudioNode<T>
) => {
    const audioNodeConnections = audioGraph.nodes.get(audioNode);

    if (audioNodeConnections !== undefined) {
        const activeInputs = audioNodeConnections.activeInputs;
        const numberOfInputs = activeInputs.length;

        for (let i = 0; i < numberOfInputs; i += 1) {
            const connections = activeInputs[i];

            for (const [ source, output ] of connections) {
                source.disconnect(audioNode, output, i);

                disconnectAudioNodeInputConnections(audioGraph, source);
            }
        }

        const audioParams = (isAudioBufferSourceNode(audioNode))
            ? [
                // Bug #149: Safari does not yet support the detune AudioParam.
                audioNode.playbackRate
            ]
            : (isAudioWorkletNode(audioNode))
                ? Array.from(audioNode.parameters.values())
                : (isBiquadFilterNode(audioNode))
                    ? [ audioNode.Q, audioNode.detune, audioNode.frequency, audioNode.gain ]
                    : (isConstantSourceNode(audioNode))
                        ? [ audioNode.offset ]
                        : (isGainNode(audioNode))
                            ? [ audioNode.gain ]
                            : (isOscillatorNode(audioNode))
                                ? [ audioNode.detune, audioNode.frequency ]
                                : (isStereoPannerNode(audioNode))
                                    ? [ audioNode.pan ]
                                    : [ ];

        for (const audioParam of audioParams) {
            disconnectAudioParamInputConnections(audioGraph, audioParam, disconnectAudioNodeInputConnections);
        }
    }
};
