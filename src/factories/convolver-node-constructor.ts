import { getNativeContext } from '../helpers/get-native-context';
import { IConvolverNode, IConvolverOptions } from '../interfaces';
import { TAnyAudioBuffer, TContext, TConvolverNodeConstructorFactory, TNativeConvolverNode } from '../types';

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

        get buffer (): null | TAnyAudioBuffer {
            if (this._isBufferNullified) {
                return null;
            }

            return this._nativeConvolverNode.buffer;
        }

        set buffer (value) {
            this._nativeConvolverNode.buffer = value;

            // Bug #115: Safari does not allow to set the buffer to null.
            if (value === null && this._nativeConvolverNode.buffer !== null) {
                const nativeContext = this._nativeConvolverNode.context;

                this._nativeConvolverNode.buffer = nativeContext.createBuffer(1, 1, nativeContext.sampleRate);
                this._isBufferNullified = true;
            } else {
                this._isBufferNullified = false;
            }
        }

        get normalize (): boolean {
            return this._nativeConvolverNode.normalize;
        }

        set normalize (value) {
            this._nativeConvolverNode.normalize = value;
        }

    };

};
