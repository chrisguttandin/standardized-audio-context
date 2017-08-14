import { RENDERER_STORE } from '../globals';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IGainNode, IGainOptions, IMinimalBaseAudioContext } from '../interfaces';
import { GainNodeRenderer } from '../renderers/gain-node';
import { TChannelCountMode, TChannelInterpretation, TNativeGainNode } from '../types';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const DEFAULT_OPTIONS: IGainOptions = {
    channelCount: 2, // @todo channelCount is not specified because it is ignored when the channelCountMode equals 'max'.
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    gain: 1,
    numberOfInputs: 1,
    numberOfOutputs: 1
};

export class GainNode extends NoneAudioDestinationNode implements IGainNode {

    constructor (context: IMinimalBaseAudioContext, options: Partial<IGainOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IGainOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = nativeContext.createGain();

        super(context, nativeNode, mergedOptions);

        if (isOfflineAudioContext(nativeContext)) {
            const gainNodeRenderer = new GainNodeRenderer(this);

            RENDERER_STORE.set(this, gainNodeRenderer);
        }
    }

    public get gain () {
        if (this._nativeNode === null) {
            throw new Error('The associated nativeNode is missing.');
        }

        if (isOfflineAudioContext(this._nativeNode.context)) {
            // @todo Wrap the AudioParam to record the actions.
        }

        return (<TNativeGainNode> this._nativeNode).gain;
    }

}
