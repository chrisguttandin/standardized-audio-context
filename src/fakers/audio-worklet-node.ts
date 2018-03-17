import { Injectable } from '@angular/core';
import { IAudioWorkletNodeOptions } from '../interfaces';
import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

@Injectable()
export class AudioWorkletNodeFaker {

    public fake (
        unpatchedAudioContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
        options: IAudioWorkletNodeOptions
    ) {
        const scriptProcessorNode = unpatchedAudioContext.createScriptProcessor(512, options.channelCount, options.channelCount);

        Object.defineProperty(scriptProcessorNode, 'channelCountMode', {
            get: () => options.channelCountMode,
            set: (value) => options.channelCountMode = value
        });

        scriptProcessorNode.onaudioprocess = ({ inputBuffer, outputBuffer }: AudioProcessingEvent) => {
            const numberOfChannels = options.channelCount;

            for (let i = 0; i < numberOfChannels; i += 1) {
                const input = inputBuffer.getChannelData(i);
                const output = outputBuffer.getChannelData(i);

                output.set(input);
            }
        };

        return scriptProcessorNode;
    }

}

export const AUDIO_WORKLET_NODE_FAKER_PROVIDER = { deps: [ ], provide: AudioWorkletNodeFaker };
