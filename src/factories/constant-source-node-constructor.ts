import { isActiveAudioNode } from '../helpers/is-active-audio-node';
import { setInternalStateToActive } from '../helpers/set-internal-state-to-active';
import { setInternalStateToPassive } from '../helpers/set-internal-state-to-passive';
import { IAudioParam, IAudioScheduledSourceNodeEventMap, IConstantSourceNode, IConstantSourceOptions } from '../interfaces';
import { TAudioNodeRenderer, TConstantSourceNodeConstructorFactory, TContext, TEventHandler, TNativeConstantSourceNode } from '../types';

const DEFAULT_OPTIONS = {
    channelCount: 2,
    channelCountMode: 'max',
    channelInterpretation: 'speakers',
    offset: 1
} as const;

export const createConstantSourceNodeConstructor: TConstantSourceNodeConstructorFactory = (
    audioNodeConstructor,
    createAudioParam,
    createConstantSourceNodeRendererFactory,
    createNativeConstantSourceNode,
    getNativeContext,
    isNativeOfflineAudioContext,
    wrapEventListener
) => {
    return class ConstantSourceNode<T extends TContext>
        extends audioNodeConstructor<T, IAudioScheduledSourceNodeEventMap>
        implements IConstantSourceNode<T>
    {
        private _nativeConstantSourceNode: TNativeConstantSourceNode;

        private _offset: IAudioParam;

        private _onended: null | TEventHandler<this>;

        constructor(context: T, options?: Partial<IConstantSourceOptions>) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeConstantSourceNode = createNativeConstantSourceNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const constantSourceNodeRenderer = <TAudioNodeRenderer<T, this>>(isOffline ? createConstantSourceNodeRendererFactory() : null);

            super(context, false, nativeConstantSourceNode, constantSourceNodeRenderer);

            this._nativeConstantSourceNode = nativeConstantSourceNode;
            this._offset = createAudioParam(this, isOffline, nativeConstantSourceNode.offset);
            this._onended = null;
        }

        get offset(): IAudioParam {
            return this._offset;
        }

        get onended(): null | TEventHandler<this> {
            return this._onended;
        }

        set onended(value) {
            const wrappedListener = typeof value === 'function' ? wrapEventListener(this, value) : null;

            this._nativeConstantSourceNode.onended = wrappedListener;

            const nativeOnEnded = this._nativeConstantSourceNode.onended;

            this._onended = nativeOnEnded !== null && nativeOnEnded === wrappedListener ? value : nativeOnEnded;
        }

        public start(when = 0): void {
            this._nativeConstantSourceNode.start(when);

            if (this.context.state !== 'closed') {
                setInternalStateToActive(this);

                const resetInternalStateToPassive = () => {
                    this._nativeConstantSourceNode.removeEventListener('ended', resetInternalStateToPassive);

                    if (isActiveAudioNode(this)) {
                        setInternalStateToPassive(this);
                    }
                };

                this._nativeConstantSourceNode.addEventListener('ended', resetInternalStateToPassive);
            }
        }

        public stop(when = 0): void {
            this._nativeConstantSourceNode.stop(when);
        }
    };
};
