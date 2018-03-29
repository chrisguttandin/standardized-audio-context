import { Injector } from '@angular/core';
import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { createNativeConstantSourceNode } from '../helpers/create-native-constant-source-node';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import {
    IAudioParam,
    IConstantSourceNode,
    IConstantSourceOptions,
    IMinimalBaseAudioContext,
    INativeConstantSourceNode
} from '../interfaces';
import { ConstantSourceNodeRenderer } from '../renderers/constant-source-node';
import { TChannelCountMode, TChannelInterpretation, TEndedEventHandler } from '../types';
import { AUDIO_PARAM_WRAPPER_PROVIDER, AudioParamWrapper } from '../wrappers/audio-param';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const injector = Injector.create({
    providers: [
        AUDIO_PARAM_WRAPPER_PROVIDER
    ]
});

const audioParamWrapper = injector.get(AudioParamWrapper);

const DEFAULT_OPTIONS: IConstantSourceOptions = {
    channelCount: 2,
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    offset: 1
};

export class ConstantSourceNode extends NoneAudioDestinationNode<INativeConstantSourceNode> implements IConstantSourceNode {

    private _constantSourceNodeRenderer: null | ConstantSourceNodeRenderer;

    constructor (context: IMinimalBaseAudioContext, options: Partial<IConstantSourceOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IConstantSourceOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = createNativeConstantSourceNode(nativeContext, mergedOptions);

        super(context, nativeNode, mergedOptions.channelCount);

        if (isOfflineAudioContext(nativeContext)) {
            const constantSourceNodeRenderer = new ConstantSourceNodeRenderer(this);

            AUDIO_NODE_RENDERER_STORE.set(this, constantSourceNodeRenderer);

            audioParamWrapper.wrap(nativeNode, context, 'offset');

            this._constantSourceNodeRenderer = constantSourceNodeRenderer;
        } else {
            this._constantSourceNodeRenderer = null;
        }
    }

    public get offset () {
        return <IAudioParam> (<any> this._nativeNode.offset);
    }

    public get onended () {
        return <TEndedEventHandler> (<any> this._nativeNode.onended);
    }

    public set onended (value) {
        this._nativeNode.onended = <any> value;
    }

    public start (when = 0) {
        this._nativeNode.start(when);

        if (this._constantSourceNodeRenderer !== null) {
            this._constantSourceNodeRenderer.start = when;
        }
    }

    public stop (when = 0) {
        this._nativeNode.stop(when);

        if (this._constantSourceNodeRenderer !== null) {
            this._constantSourceNodeRenderer.stop = when;
        }
    }

}
