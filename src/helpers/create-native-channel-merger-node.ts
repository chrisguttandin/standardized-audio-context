import { Injector } from '@angular/core';
import { INVALID_STATE_ERROR_FACTORY_PROVIDER } from '../factories/invalid-state-error';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { IChannelMergerOptions } from '../interfaces';
import { TNativeChannelMergerNode, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';
import { CHANNEL_MERGER_NODE_WRAPPER_PROVIDER, ChannelMergerNodeWrapper } from '../wrappers/channel-merger-node';

const injector = Injector.create({
    providers: [
        CHANNEL_MERGER_NODE_WRAPPER_PROVIDER,
        INVALID_STATE_ERROR_FACTORY_PROVIDER
    ]
});

const channelMergerNodeWrapper = injector.get<ChannelMergerNodeWrapper>(ChannelMergerNodeWrapper);

export const createNativeChannelMergerNode = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options: Partial<IChannelMergerOptions> = { }
): TNativeChannelMergerNode => {
    const nativeNode = nativeContext.createChannelMerger((options.numberOfInputs === undefined) ? 6 : options.numberOfInputs);

    assignNativeAudioNodeOptions(nativeNode, options);

    // Bug #15: Safari does not return the default properties.
    if (nativeNode.channelCount !== 1 &&
            nativeNode.channelCountMode !== 'explicit') {
        channelMergerNodeWrapper.wrap(nativeContext, nativeNode);
    }

    // Bug #16: Firefox does not throw an error when setting a different channelCount or channelCountMode.
    try {
        nativeNode.channelCount = (options.numberOfInputs === undefined) ? 6 : options.numberOfInputs;

        channelMergerNodeWrapper.wrap(nativeContext, nativeNode);
    } catch (err) {} // tslint:disable-line:no-empty

    return nativeNode;
};
