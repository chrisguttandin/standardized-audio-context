import { Injector } from '@angular/core';
import { INVALID_STATE_ERROR_FACTORY_PROVIDER } from '../factories/invalid-state-error';
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
import { CHANNEL_MERGER_NODE_WRAPPER_PROVIDER, ChannelMergerNodeWrapper } from '../wrappers/channel-merger-node';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const DEFAULT_OPTIONS: IChannelMergerOptions = {
    channelCount: 1,
    channelCountMode: <TChannelCountMode> 'explicit',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    numberOfInputs: 6
};

const injector = Injector.create({
    providers: [
        CHANNEL_MERGER_NODE_WRAPPER_PROVIDER,
        INVALID_STATE_ERROR_FACTORY_PROVIDER
    ]
});

const channelMergerNodeWrapper = injector.get<ChannelMergerNodeWrapper>(ChannelMergerNodeWrapper);

const createNativeNode = (nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext, numberOfInputs: number) => {
    // @todo Use this inside the AudioWorkletNodeFaker once it supports the OfflineAudioContext.
    if (isOfflineAudioContext(nativeContext)) {
        throw new Error('This is not yet supported.');
    }

    const nativeNode = nativeContext.createChannelMerger(numberOfInputs);

    // Bug #15: Safari does not return the default properties.
    if (nativeNode.channelCount !== 1 &&
            nativeNode.channelCountMode !== 'explicit') {
        channelMergerNodeWrapper.wrap(nativeContext, nativeNode);
    }

    // Bug #16: Firefox does not throw an error when setting a different channelCount or channelCountMode.
    try {
        nativeNode.channelCount = numberOfInputs;

        channelMergerNodeWrapper.wrap(nativeContext, nativeNode);
    } catch (err) {} // tslint:disable-line:no-empty

    return nativeNode;
};

export class ChannelMergerNode extends NoneAudioDestinationNode<TNativeChannelMergerNode> {

    constructor (context: IMinimalBaseAudioContext, options: Partial<IChannelMergerOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const { channelCount, numberOfInputs } = <IChannelMergerOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = createNativeNode(nativeContext, numberOfInputs);

        super(context, nativeNode, channelCount);
    }

}
