import { createNativeChannelMergerNode } from '../helpers/create-native-channel-merger-node';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IChannelMergerOptions, IMinimalBaseAudioContext } from '../interfaces';
import {
    TChannelCountMode,
    TChannelInterpretation,
    TNativeChannelMergerNode,
    TUnpatchedAudioContext,
    TUnpatchedOfflineAudioContext
} from '../types';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const DEFAULT_OPTIONS: IChannelMergerOptions = {
    channelCount: 1,
    channelCountMode: <TChannelCountMode> 'explicit',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    numberOfInputs: 6
};

const createNativeNode = (nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext, numberOfInputs: number) => {
    // @todo Use this inside the AudioWorkletNodeFaker once it supports the OfflineAudioContext.
    if (isOfflineAudioContext(nativeContext)) {
        throw new Error('This is not yet supported.');
    }

    return createNativeChannelMergerNode(nativeContext, { numberOfInputs });
};

export class ChannelMergerNode extends NoneAudioDestinationNode<TNativeChannelMergerNode> {

    constructor (context: IMinimalBaseAudioContext, options: Partial<IChannelMergerOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const { channelCount, numberOfInputs } = <IChannelMergerOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = createNativeNode(nativeContext, numberOfInputs);

        super(context, nativeNode, channelCount);
    }

}
