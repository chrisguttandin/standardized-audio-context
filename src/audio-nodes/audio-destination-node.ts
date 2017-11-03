import { RENDERER_STORE } from '../globals';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IAudioDestinationNode, IMinimalBaseAudioContext } from '../interfaces';
import { AudioDestinationNodeRenderer } from '../renderers/audio-destination-node';
import { AudioNode } from './audio-node';

export class AudioDestinationNode extends AudioNode implements IAudioDestinationNode {

    private _maxChannelCount: number;

    constructor (context: IMinimalBaseAudioContext, channelCount: number) {
        const nativeContext = getNativeContext(context);
        const nativeNode = nativeContext.destination;

        super(context, nativeNode, {
            channelCount,
            channelCountMode: 'explicit',
            channelInterpretation: 'speakers',
            numberOfInputs: 1,
            numberOfOutputs: 0
        });

        const maxChannelCount = nativeNode.maxChannelCount;

        // Bug #47: The AudioDestinationNode in Edge and Safari do not intialize the maxChannelCount property correctly.
        if (maxChannelCount === 0) {
            if (isOfflineAudioContext(nativeContext)) {
                nativeNode.channelCount = channelCount;
                nativeNode.channelCountMode = 'explicit';
            }

            this._maxChannelCount = channelCount;
        } else {
            this._maxChannelCount = nativeNode.maxChannelCount;
        }

        if (isOfflineAudioContext(nativeContext)) {
            const audioDestinationNodeRenderer = new AudioDestinationNodeRenderer();

            RENDERER_STORE.set(this, audioDestinationNodeRenderer);
        }
    }

    public get maxChannelCount () {
        return this._maxChannelCount;
    }

}
