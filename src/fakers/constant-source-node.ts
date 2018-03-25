import { Injectable } from '@angular/core';
import { IConstantSourceOptions, INativeConstantSourceNode, INativeConstantSourceNodeFaker } from '../interfaces';
import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

@Injectable()
export class ConstantSourceNodeFaker {

    public fake (
        unpatchedAudioContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
        options: Partial<IConstantSourceOptions>
    ): INativeConstantSourceNodeFaker {
        // @todo Safari does not play/loop 1 sample buffers. This should be covered by an expectation test.
        const audioBuffer = unpatchedAudioContext.createBuffer(1, 2, unpatchedAudioContext.sampleRate);
        const audioBufferSourceNode = unpatchedAudioContext.createBufferSource();
        const gainNode = unpatchedAudioContext.createGain();

        // Bug #5: Safari does not support copyFromChannel() and copyToChannel().
        const channelData = audioBuffer.getChannelData(0);

        const offset = (options.offset === undefined) ? 1 : options.offset;

        channelData[0] = offset;
        channelData[1] = offset;

        audioBufferSourceNode.buffer = audioBuffer;
        audioBufferSourceNode.loop = true;

        if (options.channelCount !== undefined) {
            gainNode.channelCount = options.channelCount;
        }

        if (options.channelCountMode !== undefined) {
            gainNode.channelCountMode = options.channelCountMode;
        }

        if (options.channelInterpretation !== undefined) {
            gainNode.channelInterpretation = options.channelInterpretation;
        }

        gainNode.gain.value = offset;

        audioBufferSourceNode.connect(gainNode);

        return {
            get bufferSize () {
                return undefined;
            },
            get channelCount () {
                return gainNode.channelCount;
            },
            set channelCount (value) {
                gainNode.channelCount = value;
            },
            get channelCountMode () {
                return gainNode.channelCountMode;
            },
            set channelCountMode (value) {
                gainNode.channelCountMode = value;
            },
            get channelInterpretation () {
                return gainNode.channelInterpretation;
            },
            set channelInterpretation (value) {
                gainNode.channelInterpretation = value;
            },
            get context () {
                return gainNode.context;
            },
            get input () {
                return undefined;
            },
            get numberOfInputs () {
                return audioBufferSourceNode.numberOfInputs;
            },
            get numberOfOutputs () {
                return gainNode.numberOfOutputs;
            },
            get offset () {
                return gainNode.gain;
            },
            get onended () {
                return <INativeConstantSourceNode['onended']> (<any> audioBufferSourceNode.onended);
            },
            set onended (value) {
                audioBufferSourceNode.onended = <any> value;
            },
            addEventListener (...args: any[]) {
                return audioBufferSourceNode.addEventListener(args[0], args[1], args[2]);
            },
            connect (...args: any[]) {
                if (args[2] === undefined) {
                    return gainNode.connect.call(gainNode, args[0], args[1]);
                }

                return gainNode.connect.call(gainNode, args[0], args[1], args[2]);
            },
            disconnect (...args: any[]) {
                return gainNode.disconnect.call(gainNode, args[0], args[1], args[2]);
            },
            dispatchEvent (...args: any[]) {
                return audioBufferSourceNode.dispatchEvent(args[0]);
            },
            removeEventListener (...args: any[]) {
                return audioBufferSourceNode.removeEventListener(args[0], args[1], args[2]);
            },
            start (when = 0) {
                audioBufferSourceNode.start.call(audioBufferSourceNode, when);
            },
            stop (when = 0) {
                audioBufferSourceNode.stop.call(audioBufferSourceNode, when);
            }
        };
    }

}

export const CONSTANT_SOURCE_NODE_FAKER_PROVIDER = { deps: [ ], provide: ConstantSourceNodeFaker };
