import { Injector } from '@angular/core';
import { INVALID_STATE_ERROR_FACTORY_PROVIDER } from '../factories/invalid-state-error';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { IChannelSplitterOptions } from '../interfaces';
import { TNativeChannelSplitterNode, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';
import { CHANNEL_SPLITTER_NODE_WRAPPER_PROVIDER, ChannelSplitterNodeWrapper } from '../wrappers/channel-splitter-node';

const injector = Injector.create({
    providers: [
        CHANNEL_SPLITTER_NODE_WRAPPER_PROVIDER,
        INVALID_STATE_ERROR_FACTORY_PROVIDER
    ]
});

const channelSplitterNodeWrapper = injector.get<ChannelSplitterNodeWrapper>(ChannelSplitterNodeWrapper);

export const createNativeChannelSplitterNode = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options: Partial<IChannelSplitterOptions> = { }
): TNativeChannelSplitterNode => {
    const nativeNode = nativeContext.createChannelSplitter((options.numberOfOutputs === undefined) ? 6 : options.numberOfOutputs);

    assignNativeAudioNodeOptions(nativeNode, options);

    // Bug #29 - #32: Only Chrome & Opera partially support the spec yet.
    channelSplitterNodeWrapper.wrap(nativeNode);

    return nativeNode;
};
