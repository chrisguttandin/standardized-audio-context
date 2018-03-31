import { createIndexSizeError } from '../factories/index-size-error';
import { createInvalidStateError } from '../factories/invalid-state-error';
import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { isAudioNode } from '../guards/audio-node';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IAudioDestinationNode, IAudioNode, IAudioParam, IMinimalBaseAudioContext } from '../interfaces';
import { AudioDestinationNodeRenderer } from '../renderers/audio-destination-node';
import { AudioNode } from './audio-node';

export class AudioDestinationNode implements IAudioDestinationNode {

    private _audioNode: IAudioNode;

    private _isOfflineAudioContext: boolean;

    private _maxChannelCount: number;

    constructor (context: IMinimalBaseAudioContext, channelCount: number) {
        const nativeContext = getNativeContext(context);
        const nativeNode = nativeContext.destination;

        /*
         * @todo Transpiling super access inside the channelCount/channelCountMode property accessors down to ES5 does not work. That's why
         * the audioNode is stored as a private property and all its methods and properties get proxied.
         */
        this._audioNode = new AudioNode(context, nativeNode, channelCount, this);
        this._isOfflineAudioContext = isOfflineAudioContext(nativeContext);

        const maxChannelCount = nativeNode.maxChannelCount;

        // Bug #47: The AudioDestinationNode in Edge and Safari do not initialize the maxChannelCount property correctly.
        if (maxChannelCount === 0) {
            if (this._isOfflineAudioContext) {
                nativeNode.channelCount = channelCount;
                nativeNode.channelCountMode = 'explicit';
            }

            this._maxChannelCount = channelCount;
        } else {
            this._maxChannelCount = nativeNode.maxChannelCount;
        }

        if (isOfflineAudioContext(nativeContext)) {
            const audioDestinationNodeRenderer = new AudioDestinationNodeRenderer();

            AUDIO_NODE_RENDERER_STORE.set(this, audioDestinationNodeRenderer);
        }
    }

    public get channelCount () {
        return this._audioNode.channelCount;
    }

    public set channelCount (value) {
        // Bug #52: Chrome, Edge, Opera & Safari do not throw an exception at all.
        // Bug #54: Firefox does throw an IndexSizeError.
        if (this._isOfflineAudioContext) {
            throw createInvalidStateError();
        }

        // Bug #47: The AudioDestinationNode in Edge and Safari do not initialize the maxChannelCount property correctly.
        if (value > this._maxChannelCount) {
            throw createIndexSizeError();
        }

        this._audioNode.channelCount = value;
    }

    public get channelCountMode () {
        return this._audioNode.channelCountMode;
    }

    public set channelCountMode (value) {
        // Bug #53: No browser does throw an exception yet.
        if (this._isOfflineAudioContext) {
            throw createInvalidStateError();
        }

        this._audioNode.channelCountMode = value;
    }

    public get channelInterpretation () {
        return this._audioNode.channelInterpretation;
    }

    public set channelInterpretation (value) {
        this._audioNode.channelInterpretation = value;
    }

    public get context () {
        return this._audioNode.context;
    }

    public get maxChannelCount () {
        return this._maxChannelCount;
    }

    public get numberOfInputs () {
        return this._audioNode.numberOfInputs;
    }

    public get numberOfOutputs () {
        return this._audioNode.numberOfOutputs;
    }

    public addEventListener (
        type: string,
        listener: any, // @todo EventListenerOrEventListenerObject | null = null,
        options?: boolean | AddEventListenerOptions
    ): void {
        return this._audioNode.addEventListener(type, listener, options);
    }

    public dispatchEvent (evt: Event) {
        return this._audioNode.dispatchEvent(evt);
    }

    public connect (destinationNode: IAudioNode, output?: number, input?: number): IAudioNode;
    public connect (destinationParam: IAudioParam, output?: number): void;
    public connect (destination: IAudioNode | IAudioParam, output = 0, input = 0): void | IAudioNode {
        if (isAudioNode(destination)) {
            return this._audioNode.connect(destination, output, input);
        }

        return this._audioNode.connect(destination, output);
    }

    public disconnect (destination?: IAudioNode): void {
        return this._audioNode.disconnect(destination);
    }

    public removeEventListener (
        type: string,
        listener: any, // @todo EventListenerOrEventListenerObject | null = null,
        options?: EventListenerOptions | boolean
    ): void {
        return this._audioNode.removeEventListener(type, listener, options);
    }

}
