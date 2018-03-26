import { createNativeChannelSplitterNode } from '../helpers/create-native-channel-splitter-node';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IChannelSplitterOptions, IMinimalBaseAudioContext } from '../interfaces';
import {
    TChannelCountMode,
    TChannelInterpretation,
    TNativeChannelSplitterNode,
    TUnpatchedAudioContext,
    TUnpatchedOfflineAudioContext
} from '../types';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const DEFAULT_OPTIONS: IChannelSplitterOptions = {
    channelCount: 6,
    channelCountMode: <TChannelCountMode> 'explicit',
    channelInterpretation: <TChannelInterpretation> 'discrete',
    numberOfOutputs: 6
};

const createNativeNode = (nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext, numberOfOutputs: number) => {
    // @todo Use this inside the AudioWorkletNodeFaker once it supports the OfflineAudioContext.
    if (isOfflineAudioContext(nativeContext)) {
        throw new Error('This is not yet supported.');
    }

    return createNativeChannelSplitterNode(nativeContext, { numberOfOutputs });
};

export class ChannelSplitterNode extends NoneAudioDestinationNode<TNativeChannelSplitterNode> {

    constructor (context: IMinimalBaseAudioContext, options: Partial<IChannelSplitterOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const { numberOfOutputs } = <IChannelSplitterOptions> { ...DEFAULT_OPTIONS, ...options };

        const nativeNode = createNativeNode(nativeContext, numberOfOutputs);

        super(context, nativeNode, numberOfOutputs);
    }

}
