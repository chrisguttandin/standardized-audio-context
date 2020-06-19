import { MOST_NEGATIVE_SINGLE_FLOAT, MOST_POSITIVE_SINGLE_FLOAT } from '../constants';
import { setInternalStateToActive } from '../helpers/set-internal-state-to-active';
import { setInternalStateToPassive } from '../helpers/set-internal-state-to-passive';
import { IAudioParam, IConstantSourceNode, IConstantSourceOptions } from '../interfaces';
import {
    TConstantSourceNodeConstructorFactory,
    TConstantSourceNodeRenderer,
    TContext,
    TEventHandler,
    TNativeConstantSourceNode
} from '../types';

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
    return class ConstantSourceNode<T extends TContext> extends audioNodeConstructor<T> implements IConstantSourceNode<T> {
        private _constantSourceNodeRenderer: TConstantSourceNodeRenderer<T>;

        private _nativeConstantSourceNode: TNativeConstantSourceNode;

        private _offset: IAudioParam;

        private _onended: null | TEventHandler<this>;

        constructor(context: T, options: Partial<IConstantSourceOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeConstantSourceNode = createNativeConstantSourceNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const constantSourceNodeRenderer = <TConstantSourceNodeRenderer<T>>(
                (isOffline ? createConstantSourceNodeRendererFactory() : null)
            );

            super(context, false, nativeConstantSourceNode, constantSourceNodeRenderer);

            this._constantSourceNodeRenderer = constantSourceNodeRenderer;
            this._nativeConstantSourceNode = nativeConstantSourceNode;
            /*
             * Bug #62 & #74: Edge & Safari do not support ConstantSourceNodes and do not export the correct values for maxValue and
             * minValue for GainNodes.
             */
            this._offset = createAudioParam(
                this,
                isOffline,
                nativeConstantSourceNode.offset,
                MOST_POSITIVE_SINGLE_FLOAT,
                MOST_NEGATIVE_SINGLE_FLOAT
            );
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

            this._onended = nativeOnEnded !== null && nativeOnEnded === wrappedListener ? value : <null | TEventHandler<this>>nativeOnEnded;
        }

        public start(when = 0): void {
            this._nativeConstantSourceNode.start(when);

            if (this._constantSourceNodeRenderer !== null) {
                this._constantSourceNodeRenderer.start = when;
            } else {
                setInternalStateToActive(this);

                const resetInternalStateToPassive = () => {
                    this._nativeConstantSourceNode.removeEventListener('ended', resetInternalStateToPassive);

                    // @todo Determine a meaningful delay instead of just using one second.
                    setTimeout(() => setInternalStateToPassive(this), 1000);
                };

                this._nativeConstantSourceNode.addEventListener('ended', resetInternalStateToPassive);
            }
        }

        public stop(when = 0): void {
            this._nativeConstantSourceNode.stop(when);

            if (this._constantSourceNodeRenderer !== null) {
                this._constantSourceNodeRenderer.stop = when;
            }
        }
    };
};
