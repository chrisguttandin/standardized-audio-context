import { getNativeContext } from '../helpers/get-native-context';
import { IAudioParam, IDelayNode, IDelayOptions } from '../interfaces';
import { TContext, TDelayNodeConstructorFactory } from '../types';

const DEFAULT_OPTIONS: IDelayOptions = {
    channelCount: 2,
    channelCountMode: 'max',
    channelInterpretation: 'speakers',
    delayTime: 0,
    maxDelayTime: 1
};

export const createDelayNodeConstructor: TDelayNodeConstructorFactory = (
    createAudioParam,
    createDelayNodeRenderer,
    createNativeDelayNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class DelayNode extends noneAudioDestinationNodeConstructor implements IDelayNode {

        private _delayTime: IAudioParam;

        constructor (context: TContext, options: Partial<IDelayOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeDelayNode = createNativeDelayNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const delayNodeRenderer = (isOffline) ? createDelayNodeRenderer(mergedOptions.maxDelayTime) : null;

            super(context, nativeDelayNode, delayNodeRenderer);

            // @todo Edge does not export the correct values for maxValue and minValue.
            this._delayTime = createAudioParam(
                context,
                isOffline,
                nativeDelayNode.delayTime,
                mergedOptions.maxDelayTime,
                0
            );
        }

        public get delayTime (): IAudioParam {
            return this._delayTime;
        }

    };

};
