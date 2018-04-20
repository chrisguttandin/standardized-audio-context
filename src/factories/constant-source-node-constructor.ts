import { getNativeContext } from '../helpers/get-native-context';
import {
    IAudioParam,
    IConstantSourceNode,
    IConstantSourceNodeRenderer,
    IConstantSourceOptions,
    INativeConstantSourceNode
} from '../interfaces';
import {
    TChannelCountMode,
    TChannelInterpretation,
    TConstantSourceNodeConstructorFactory,
    TContext,
    TEndedEventHandler
} from '../types';

const DEFAULT_OPTIONS: IConstantSourceOptions = {
    channelCount: 2,
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    offset: 1
};

export const createConstantSourceNodeConstructor: TConstantSourceNodeConstructorFactory = (
    createAudioParam,
    createConstantSourceNodeRendererFactory,
    createNativeConstantSourceNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class ConstantSourceNode extends noneAudioDestinationNodeConstructor implements IConstantSourceNode {

        private _constantSourceNodeRenderer: null | IConstantSourceNodeRenderer;

        private _nativeConstantSourceNode: INativeConstantSourceNode;

        private _offset: IAudioParam;

        constructor (context: TContext, options: Partial<IConstantSourceOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IConstantSourceOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeConstantSourceNode = createNativeConstantSourceNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const constantSourceNodeRenderer = (isOffline) ? createConstantSourceNodeRendererFactory() : null;

            super(context, nativeConstantSourceNode, constantSourceNodeRenderer);

            this._constantSourceNodeRenderer = constantSourceNodeRenderer;
            this._nativeConstantSourceNode = nativeConstantSourceNode;
            /*
             * Bug #62 & #74: Edge & Safari do not support ConstantSourceNodes and do not export the correct values for maxValue and
             * minValue for GainNodes.
             * Bug #75: Firefox does not export the correct values for maxValue and minValue.
             */
            this._offset = createAudioParam(
                context,
                isOffline,
                nativeConstantSourceNode.offset,
                3.4028234663852886e38,
                -3.4028234663852886e38
            );
        }

        public get offset () {
            return this._offset;
        }

        public get onended () {
            return <TEndedEventHandler> (<any> this._nativeConstantSourceNode.onended);
        }

        public set onended (value) {
            this._nativeConstantSourceNode.onended = <any> value;
        }

        public start (when = 0) {
            this._nativeConstantSourceNode.start(when);

            if (this._constantSourceNodeRenderer !== null) {
                this._constantSourceNodeRenderer.start = when;
            }
        }

        public stop (when = 0) {
            this._nativeConstantSourceNode.stop(when);

            if (this._constantSourceNodeRenderer !== null) {
                this._constantSourceNodeRenderer.stop = when;
            }
        }

    };

};
