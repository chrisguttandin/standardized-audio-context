import { Injector } from '@angular/core';
import { INVALID_STATE_ERROR_FACTORY_PROVIDER } from '../factories/invalid-state-error';
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
import { CHANNEL_SPLITTER_NODE_WRAPPER_PROVIDER, ChannelSplitterNodeWrapper } from '../wrappers/channel-splitter-node';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const DEFAULT_OPTIONS: IChannelSplitterOptions = {
    channelCount: 6,
    channelCountMode: <TChannelCountMode> 'explicit',
    channelInterpretation: <TChannelInterpretation> 'discrete',
    numberOfOutputs: 6
};

const injector = Injector.create({
    providers: [
        CHANNEL_SPLITTER_NODE_WRAPPER_PROVIDER,
        INVALID_STATE_ERROR_FACTORY_PROVIDER
    ]
});

const channelSplitterNodeWrapper = injector.get<ChannelSplitterNodeWrapper>(ChannelSplitterNodeWrapper);

const createNativeNode = (nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext, numberOfOutputs: number) => {
    // @todo Use this inside the AudioWorkletNodeFaker once it supports the OfflineAudioContext.
    if (isOfflineAudioContext(nativeContext)) {
        throw new Error('This is not yet supported.');
    }

    const nativeNode = nativeContext.createChannelSplitter(numberOfOutputs);

    // Bug #29 - #32: Only Chrome partially supports the spec yet.
    channelSplitterNodeWrapper.wrap(nativeNode);

    return nativeNode;
};

export class ChannelSplitterNode extends NoneAudioDestinationNode<TNativeChannelSplitterNode> {

    constructor (context: IMinimalBaseAudioContext, options: Partial<IChannelSplitterOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const { numberOfOutputs } = <IChannelSplitterOptions> { ...DEFAULT_OPTIONS, ...options };

        const nativeNode = createNativeNode(nativeContext, numberOfOutputs);

        super(context, nativeNode, numberOfOutputs);
    }

}
