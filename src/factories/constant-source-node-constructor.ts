import { AudioParam } from '../audio-param';
import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { createNativeConstantSourceNode } from '../helpers/create-native-constant-source-node';
import { getNativeContext } from '../helpers/get-native-context';
import {
    IAudioParam,
    IConstantSourceNode,
    IConstantSourceOptions,
    IMinimalBaseAudioContext,
    INativeConstantSourceNode
} from '../interfaces';
import { ConstantSourceNodeRenderer } from '../renderers/constant-source-node';
import { TChannelCountMode, TChannelInterpretation, TConstantSourceNodeConstructorFactory, TEndedEventHandler } from '../types';

const DEFAULT_OPTIONS: IConstantSourceOptions = {
    channelCount: 2,
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    offset: 1
};

export const createConstantSourceNodeConstructor: TConstantSourceNodeConstructorFactory = (
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class ConstantSourceNode extends noneAudioDestinationNodeConstructor implements IConstantSourceNode {

        private _constantSourceNodeRenderer: null | ConstantSourceNodeRenderer;

        private _nativeNode: INativeConstantSourceNode;

        private _offset: IAudioParam;

        constructor (context: IMinimalBaseAudioContext, options: Partial<IConstantSourceOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IConstantSourceOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeNode = createNativeConstantSourceNode(nativeContext, mergedOptions);

            super(context, nativeNode);

            this._nativeNode = nativeNode;
            /*
             * Bug #62 & #74: Edge & Safari do not support ConstantSourceNodes and do not export the correct values for maxValue and
             * minValue for GainNodes.
             * Bug #75: Firefox does not export the correct values for maxValue and minValue.
             */
            this._offset = new AudioParam({
                context,
                isAudioParamOfOfflineAudioContext: isNativeOfflineAudioContext(nativeContext),
                maxValue: 3.4028234663852886e38,
                minValue: -3.4028234663852886e38,
                nativeAudioParam: nativeNode.offset
            });

            if (isNativeOfflineAudioContext(nativeContext)) {
                const constantSourceNodeRenderer = new ConstantSourceNodeRenderer(this);

                AUDIO_NODE_RENDERER_STORE.set(this, constantSourceNodeRenderer);

                this._constantSourceNodeRenderer = constantSourceNodeRenderer;
            } else {
                this._constantSourceNodeRenderer = null;
            }
        }

        public get offset () {
            return this._offset;
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

    };

};
