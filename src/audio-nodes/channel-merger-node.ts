import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { ReflectiveInjector } from '@angular/core'; // tslint:disable-line:ordered-imports
import { InvalidStateErrorFactory } from '../factories/invalid-state-error';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IAudioNodeOptions, IMinimalBaseAudioContext } from '../interfaces';
import { TChannelCountMode, TChannelInterpretation, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';
import { ChannelMergerNodeWrapper } from '../wrappers/channel-merger-node';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const DEFAULT_OPTIONS: IAudioNodeOptions = {
    channelCount: 1,
    channelCountMode: <TChannelCountMode> 'explicit',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    numberOfInputs: 6,
    numberOfOutputs: 1
};

const injector = ReflectiveInjector.resolveAndCreate([
    ChannelMergerNodeWrapper,
    InvalidStateErrorFactory
]);

const channelMergerNodeWrapper = injector.get(ChannelMergerNodeWrapper);

const createNativeNode = (nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext, numberOfInputs: number) => {
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

export class ChannelMergerNode extends NoneAudioDestinationNode {

    constructor (context: IMinimalBaseAudioContext, options: Partial<IAudioNodeOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IAudioNodeOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = createNativeNode(nativeContext, mergedOptions.numberOfInputs);

        super(context, nativeNode, mergedOptions);
    }

}
