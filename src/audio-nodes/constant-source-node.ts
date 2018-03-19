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
import {
    TChannelCountMode,
    TChannelInterpretation,
    TEndedEventHandler
} from '../types';
import { AUDIO_PARAM_WRAPPER_PROVIDER, AudioParamWrapper } from '../wrappers/audio-param';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const injector = Injector.create({
    providers: [
        AUDIO_PARAM_WRAPPER_PROVIDER
    ]
});

const audioParamWrapper = injector.get(AudioParamWrapper);

const DEFAULT_OPTIONS: IConstantSourceOptions = {
    channelCount: 2, // @todo channelCount is not specified because it is ignored when the channelCountMode equals 'max'.
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    numberOfInputs: 1,
    numberOfOutputs: 1,
    offset: 1
};

export class ConstantSourceNode extends NoneAudioDestinationNode<INativeConstantSourceNode> implements IConstantSourceNode {

    constructor (context: IMinimalBaseAudioContext, options: Partial<IConstantSourceOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IConstantSourceOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = createNativeConstantSourceNode(nativeContext);

        // @todo Firefox returns a channelCount of 1 instead of 2.
        if (nativeNode.channelCount === 1) {
            nativeNode.channelCount = 2;
        }

        super(context, nativeNode, mergedOptions);

        if (isOfflineAudioContext(nativeContext)) {
            const constantSourceNodeRenderer = new ConstantSourceNodeRenderer(this);

            AUDIO_NODE_RENDERER_STORE.set(this, constantSourceNodeRenderer);

            audioParamWrapper.wrap(nativeNode, context, 'offset');
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
    }

    public stop (when = 0) {
        this._nativeNode.stop(when);
    }

}
