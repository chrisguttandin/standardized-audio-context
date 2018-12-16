import { getNativeContext } from '../helpers/get-native-context';
import { IAudioBuffer, IConvolverNode, IConvolverOptions } from '../interfaces';
import { TContext, TConvolverNodeConstructorFactory, TNativeConvolverNode } from '../types';

const DEFAULT_OPTIONS: IConvolverOptions = {
    buffer: null,
    channelCount: 2,
    channelCountMode: 'clamped-max',
    channelInterpretation: 'speakers',
    disableNormalization: false
};

export const createConvolverNodeConstructor: TConvolverNodeConstructorFactory = (
    createConvolverNodeRenderer,
    createNativeConvolverNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class ConvolverNode extends noneAudioDestinationNodeConstructor implements IConvolverNode {

        private _isBufferNullified: boolean;

        private _nativeConvolverNode: TNativeConvolverNode;

        constructor (context: TContext, options: Partial<IConvolverOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeConvolverNode = createNativeConvolverNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const convolverNodeRenderer = (isOffline) ? createConvolverNodeRenderer() : null;

            super(context, nativeConvolverNode, convolverNodeRenderer);

            this._isBufferNullified = false;
            this._nativeConvolverNode = nativeConvolverNode;
        }

        public get buffer (): null | IAudioBuffer {
            if (this._isBufferNullified) {
                return null;
            }

            return this._nativeConvolverNode.buffer;
        }

        public set buffer (value) {
            this._nativeConvolverNode.buffer = value;

            // Bug #115: Safari does not allow to set the buffer to null.
            // @todo Create a new internal nativeConvolverNode.
            this._isBufferNullified = (value === null && this._nativeConvolverNode.buffer !== null);
        }

        public get normalize (): boolean {
            return this._nativeConvolverNode.normalize;
        }

        public set normalize (value) {
            this._nativeConvolverNode.normalize = value;
        }

    };

};
