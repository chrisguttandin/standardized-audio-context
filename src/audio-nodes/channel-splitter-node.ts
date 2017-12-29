import { Injector } from '@angular/core';
import { INVALID_STATE_ERROR_FACTORY_PROVIDER } from '../factories/invalid-state-error';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IAudioNodeOptions, IMinimalBaseAudioContext } from '../interfaces';
import { TChannelCountMode, TChannelInterpretation, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';
import { CHANNEL_SPLITTER_NODE_WRAPPER_PROVIDER, ChannelSplitterNodeWrapper } from '../wrappers/channel-splitter-node';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const DEFAULT_OPTIONS: IAudioNodeOptions = {
    channelCount: 6,
    channelCountMode: <TChannelCountMode> 'explicit',
    channelInterpretation: <TChannelInterpretation> 'discrete',
    numberOfInputs: 1,
    numberOfOutputs: 6
};

const injector = Injector.create([
    CHANNEL_SPLITTER_NODE_WRAPPER_PROVIDER,
    INVALID_STATE_ERROR_FACTORY_PROVIDER
]);

const channelSplitterNodeWrapper = injector.get(ChannelSplitterNodeWrapper);

const createNativeNode = (nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext, numberOfOutputs: number) => {
    if (isOfflineAudioContext(nativeContext)) {
        throw new Error('This is not yet supported.');
    }

    const nativeNode = nativeContext.createChannelSplitter(numberOfOutputs);

    // Bug #29 - #32: Only Chrome partially supports the spec yet.
    channelSplitterNodeWrapper.wrap(nativeNode);

    return nativeNode;
};

export class ChannelSplitterNode extends NoneAudioDestinationNode {

    constructor (context: IMinimalBaseAudioContext, options: Partial<IAudioNodeOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IAudioNodeOptions> { ...DEFAULT_OPTIONS, ...options };

        mergedOptions.channelCount = mergedOptions.numberOfOutputs;

        const nativeNode = createNativeNode(nativeContext, mergedOptions.numberOfOutputs);

        super(context, nativeNode, mergedOptions);
    }

}
