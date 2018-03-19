import { Injectable } from '@angular/core';
import { createNativeConstantSourceNode } from '../helpers/create-native-constant-source-node';
import {
    IAudioWorkletNodeOptions,
    IAudioWorkletProcessorConstructor,
    INativeAudioWorkletNodeFaker
} from '../interfaces';
import { ReadOnlyMap } from '../read-only-map';
import { TNativeAudioParam, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';
import { ChannelMergerNodeWrapper } from '../wrappers/channel-merger-node';
import { ChannelSplitterNodeWrapper } from '../wrappers/channel-splitter-node';

@Injectable()
export class AudioWorkletNodeFaker {

    constructor (
        private _channelMergerNodeWrapper: ChannelMergerNodeWrapper,
        private _channelSplitterNodeWrapper: ChannelSplitterNodeWrapper
    ) { }

    public fake (
        unpatchedAudioContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
        processorDefinition: IAudioWorkletProcessorConstructor,
        options: IAudioWorkletNodeOptions
    ): INativeAudioWorkletNodeFaker {
        const audioWorkletProcessor = new processorDefinition();
        const bufferSize = 512;
        const gainNode = unpatchedAudioContext.createGain();
        const numberOfChannels = options.channelCount;
        const numberOfParameters = processorDefinition.parameterDescriptors.length;
        const inputChannelSplitterNode = unpatchedAudioContext.createChannelSplitter(numberOfChannels);
        // @todo Create multiple ChannelMergerNodes to support more than (6 - numberOfChannels) parameters.
        const inputChannelMergerNode = unpatchedAudioContext.createChannelMerger(numberOfChannels + numberOfParameters);
        const outputChannelSplitterNode = unpatchedAudioContext.createChannelSplitter(numberOfChannels + numberOfParameters);
        const outputChannelMergerNode = unpatchedAudioContext.createChannelMerger(numberOfChannels);
        // @todo Create multiple ScriptProcessorNodes to support multiple channels.
        const scriptProcessorNode = unpatchedAudioContext.createScriptProcessor(
            bufferSize,
            numberOfChannels + numberOfParameters,
            numberOfChannels
        );

        gainNode.channelCount = numberOfChannels;

        // Bug #15: Safari does not return the default properties.
        if (inputChannelMergerNode.channelCount !== 1 &&
                inputChannelMergerNode.channelCountMode !== 'explicit') {
            this._channelMergerNodeWrapper.wrap(unpatchedAudioContext, inputChannelMergerNode);
        }

        // Bug #29 - #32: Only Chrome partially supports the spec yet.
        this._channelSplitterNodeWrapper.wrap(inputChannelSplitterNode);

        // Bug #15: Safari does not return the default properties.
        if (outputChannelMergerNode.channelCount !== 1 &&
                outputChannelMergerNode.channelCountMode !== 'explicit') {
            this._channelMergerNodeWrapper.wrap(unpatchedAudioContext, outputChannelMergerNode);
        }

        // Bug #29 - #32: Only Chrome partially supports the spec yet.
        this._channelSplitterNodeWrapper.wrap(outputChannelSplitterNode);

        const inputs: Float32Array[][] = [ ];
        const outputs: Float32Array[][] = [ ];

        // @todo Handle multiple inputs and/or outputs ...
        const input = [ ];
        const output = [ ];

        for (let i = 0; i < numberOfChannels; i += 1) {
            input.push(new Float32Array(128));
            output.push(new Float32Array(128));
        }

        inputs.push(input);
        outputs.push(output);

        gainNode.connect(inputChannelSplitterNode);

        for (let i = 0; i < numberOfChannels; i += 1) {
            inputChannelSplitterNode.connect(inputChannelMergerNode, i, i);
        }

        const parameterMap = new ReadOnlyMap(
            processorDefinition.parameterDescriptors
                .map(({ name }, index) => {
                    // @todo Support defaultValue = 0, maxValue = 3.4028235e38 and minValue = -3.4028235e38.

                    const constantSourceNode = createNativeConstantSourceNode(unpatchedAudioContext);

                    constantSourceNode.connect(inputChannelMergerNode, 0, numberOfChannels + index);
                    constantSourceNode.start(0);

                    return <[ string, TNativeAudioParam ]> [ name, constantSourceNode.offset ];
                }));
        const parameters: { [ name: string ]: Float32Array } = processorDefinition.parameterDescriptors
            .reduce((prmtrs, { name }) => ({ ...prmtrs, [ name ]: new Float32Array(128) }), { });

        // Bug #11: Safari does not support chaining yet.
        inputChannelMergerNode.connect(scriptProcessorNode);
        scriptProcessorNode.connect(outputChannelSplitterNode);

        for (let i = 0; i < numberOfChannels; i += 1) {
            outputChannelSplitterNode.connect(outputChannelMergerNode, i, i);
        }

        scriptProcessorNode.onaudioprocess = ({ inputBuffer, outputBuffer }: AudioProcessingEvent) => {
            for (let i = 0; i < bufferSize; i += 128) {
                // @todo Handle multiple inputs ...
                for (let j = 0; j < numberOfChannels; j += 1) {
                    // Bug #5: Safari does not support copyFromChannel().
                    const slicedInputBuffer = inputBuffer
                        .getChannelData(j)
                        .slice(i, i + 128);

                    inputs[0][j].set(slicedInputBuffer);
                }

                processorDefinition.parameterDescriptors.forEach(({ name }, index) => {
                    const slicedInputBuffer = inputBuffer
                        .getChannelData(numberOfChannels + index)
                        .slice(i, i + 128);

                    parameters[ name ].set(slicedInputBuffer);
                });

                /* @todo const result = */audioWorkletProcessor.process(inputs, outputs, parameters);

                // @todo Handle multiple outputs ...
                for (let j = 0; j < numberOfChannels; j += 1) {
                    // Bug #5: Safari does not support copyToChannel().

                    outputBuffer
                        .getChannelData(j)
                        .set(outputs[0][j], i);
                }
            }
        };

        return {
            get bufferSize () {
                return bufferSize;
            },
            get channelCount () {
                return gainNode.channelCount;
            },
            get channelCountMode () {
                return gainNode.channelCountMode;
            },
            get channelInterpretation () {
                return gainNode.channelInterpretation;
            },
            get context () {
                return gainNode.context;
            },
            get input () {
                return gainNode;
            },
            get numberOfInputs () {
                return gainNode.numberOfInputs;
            },
            get numberOfOutputs () {
                return gainNode.numberOfOutputs;
            },
            get onprocessorstatechange () {
                return null;
            },
            get parameters () {
                return parameterMap;
            },
            get port () {
                return (new MessageChannel()).port1;
            },
            get processorState () {
                // @todo Implement processorState.
                return <any> 'pending';
            },
            addEventListener (...args: any[]) {
                return gainNode.addEventListener(args[0], args[1], args[2]);
            },
            connect (...args: any[]) {
                if (args[2] === undefined) {
                    return outputChannelMergerNode.connect.call(outputChannelMergerNode, args[0], args[1]);
                }

                return outputChannelMergerNode.connect.call(outputChannelMergerNode, args[0], args[1], args[2]);
            },
            disconnect (...args: any[]) {
                if (args[0] === undefined) {
                    return outputChannelMergerNode.disconnect.call(outputChannelMergerNode);
                }

                return outputChannelMergerNode.disconnect.call(outputChannelMergerNode, args[0], args[1], args[2]);
            },
            dispatchEvent (...args: any[]) {
                return gainNode.dispatchEvent(args[0]);
            },
            removeEventListener (...args: any[]) {
                return gainNode.removeEventListener(args[0], args[1], args[2]);
            }
        };
    }

}

export const AUDIO_WORKLET_NODE_FAKER_PROVIDER = {
    deps: [ ChannelMergerNodeWrapper, ChannelSplitterNodeWrapper ],
    provide: AudioWorkletNodeFaker
};
