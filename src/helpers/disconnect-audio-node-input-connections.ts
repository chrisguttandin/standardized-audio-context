import { isAudioBufferSourceNode } from '../guards/audio-buffer-source-node';
import { isAudioWorkletNode } from '../guards/audio-worklet-node';
import { isBiquadFilterNode } from '../guards/biquad-filter-node';
import { isConstantSourceNode } from '../guards/constant-source-node';
import { isGainNode } from '../guards/gain-node';
import { isOscillatorNode } from '../guards/oscillator-node';
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

        if (isAudioBufferSourceNode(audioNode)) {
            // @todo disconnectAudioParamInputConnections(audioGraph, audioNode.detune, disconnectAudioNodeInputConnections);
            disconnectAudioParamInputConnections(audioGraph, audioNode.playbackRate, disconnectAudioNodeInputConnections);
        } else if (isAudioWorkletNode(audioNode)) {
            for (const audioParam of Array.from(audioNode.parameters.values())) {
                disconnectAudioParamInputConnections(audioGraph, audioParam, disconnectAudioNodeInputConnections);
            }
        } else if (isBiquadFilterNode(audioNode)) {
            disconnectAudioParamInputConnections(audioGraph, audioNode.Q, disconnectAudioNodeInputConnections);
            disconnectAudioParamInputConnections(audioGraph, audioNode.detune, disconnectAudioNodeInputConnections);
            disconnectAudioParamInputConnections(audioGraph, audioNode.frequency, disconnectAudioNodeInputConnections);
            disconnectAudioParamInputConnections(audioGraph, audioNode.gain, disconnectAudioNodeInputConnections);
        } else if (isConstantSourceNode(audioNode)) {
            disconnectAudioParamInputConnections(audioGraph, audioNode.offset, disconnectAudioNodeInputConnections);
        } else if (isGainNode(audioNode)) {
            disconnectAudioParamInputConnections(audioGraph, audioNode.gain, disconnectAudioNodeInputConnections);
        } else if (isOscillatorNode(audioNode)) {
            disconnectAudioParamInputConnections(audioGraph, audioNode.detune, disconnectAudioNodeInputConnections);
            disconnectAudioParamInputConnections(audioGraph, audioNode.frequency, disconnectAudioNodeInputConnections);
        }
    }
};
