import { isAudioBufferSourceNode } from '../guards/audio-buffer-source-node';
import { isAudioWorkletNode } from '../guards/audio-worklet-node';
import { isBiquadFilterNode } from '../guards/biquad-filter-node';
import { isConstantSourceNode } from '../guards/constant-source-node';
import { isGainNode } from '../guards/gain-node';
import { isOscillatorNode } from '../guards/oscillator-node';
import { isStereoPannerNode } from '../guards/stereo-panner-node';
import { IAudioGraph, IAudioNode } from '../interfaces';
import { disconnectAudioParamInputConnections } from './disconnect-audio-param-input-connections';

export const disconnectAudioNodeInputConnections = (audioGraph: IAudioGraph, audioNode: IAudioNode) => {
    const audioNodeConnections = audioGraph.nodes.get(audioNode);

    if (audioNodeConnections !== undefined) {
        const numberOfInputs = audioNodeConnections.inputs.length;

        for (let i = 0; i < numberOfInputs; i += 1) {
            const connections = audioNodeConnections.inputs[i];

            for (const [ source ] of Array.from(connections)) {
                // @todo Disconnect the exact connection with its output and input parameters.
                source.disconnect(audioNode);

                disconnectAudioNodeInputConnections(audioGraph, source);
            }
        }

        const audioParams = (isAudioBufferSourceNode(audioNode))
            ? [ /* @todo audioNode.detune, */ audioNode.playbackRate ]
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
