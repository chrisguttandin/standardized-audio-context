import { NODE_NAME_TO_PROCESSOR_CONSTRUCTOR_MAPS } from '../globals';
import { IAudioParam, IAudioWorkletNode, IAudioWorkletNodeOptions, IMinimalAudioContext, IReadOnlyMap } from '../interfaces';
import { ReadOnlyMap } from '../read-only-map';
import {
    TAudioNodeRenderer,
    TAudioParamMap,
    TAudioWorkletNodeConstructorFactory,
    TContext,
    TNativeAudioParam,
    TNativeAudioWorkletNode,
    TProcessorErrorEventHandler
} from '../types';

const DEFAULT_OPTIONS = {
    channelCount: 2,
    // Bug #61: The channelCountMode should be 'max' according to the spec but is set to 'explicit' to achieve consistent behavior.
    channelCountMode: 'explicit',
    channelInterpretation: 'speakers',
    numberOfInputs: 1,
    numberOfOutputs: 1,
    outputChannelCount: undefined,
    parameterData: { },
    processorOptions: { }
} as const;

const createChannelCount = (length: number): number[] => {
    const channelCount: number[] = [ ];

    for (let i = 0; i < length; i += 1) {
        channelCount.push(1);
    }

    return channelCount;
};

const sanitizedOptions = (options: IAudioWorkletNodeOptions): { outputChannelCount: number[] } & IAudioWorkletNodeOptions => {
    return {
        ...options,
        outputChannelCount: (options.outputChannelCount !== undefined) ?
            options.outputChannelCount :
            (options.numberOfInputs === 1 && options.numberOfOutputs === 1) ?
                /*
                 * Bug #61: This should be the computedNumberOfChannels, but unfortunately that is almost impossible to fake. That's why
                 * the channelCountMode is required to be 'explicit' as long as there is not a native implementation in every browser. That
                 * makes sure the computedNumberOfChannels is equivilant to the channelCount which makes it much easier to compute.
                 */
                [ options.channelCount ] :
                createChannelCount(options.numberOfOutputs)
    };
};

export const createAudioWorkletNodeConstructor: TAudioWorkletNodeConstructorFactory = (
    audioNodeConstructor,
    createAudioParam,
    createAudioWorkletNodeRenderer,
    createNativeAudioWorkletNode,
    gainNodeConstructor,
    getNativeContext,
    isNativeOfflineAudioContext,
    nativeAudioWorkletNodeConstructor,
    wrapEventListener
) => {

    return class AudioWorkletNode<T extends TContext> extends audioNodeConstructor<T> implements IAudioWorkletNode<T> {

        private _nativeAudioWorkletNode: TNativeAudioWorkletNode;

        private _numberOfOutputs: number;

        private _onprocessorerror: null | TProcessorErrorEventHandler<IAudioWorkletNode<T>>;

        private _parameters: null | TAudioParamMap;

        constructor (context: T, name: string, options: Partial<IAudioWorkletNodeOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const mergedOptions = sanitizedOptions({ ...DEFAULT_OPTIONS, ...options });
            const nodeNameToProcessorConstructorMap = NODE_NAME_TO_PROCESSOR_CONSTRUCTOR_MAPS.get(nativeContext);
            const processorConstructor = (nodeNameToProcessorConstructorMap === undefined) ?
                undefined :
                nodeNameToProcessorConstructorMap.get(name);
            const nativeAudioWorkletNode = createNativeAudioWorkletNode(
                nativeContext,
                isOffline ? null : (<IMinimalAudioContext> (<any> context)).baseLatency,
                nativeAudioWorkletNodeConstructor,
                name,
                processorConstructor,
                mergedOptions
            );
            const audioWorkletNodeRenderer = <TAudioNodeRenderer<T, this>> ((isOffline)
                ? createAudioWorkletNodeRenderer(name, mergedOptions, processorConstructor)
                : null);

            /*
             * @todo Add a mechanism to switch an AudioWorkletNode to passive once the process() function of the AudioWorkletProcessor
             * returns false.
             */
            super(context, true, nativeAudioWorkletNode, audioWorkletNodeRenderer);

            const parameters: [ string, IAudioParam ][] = [ ];

            nativeAudioWorkletNode.parameters.forEach((nativeAudioParam, nm) => {
                const audioParam = createAudioParam(this, isOffline, nativeAudioParam);

                parameters.push([ nm, audioParam ]);
            });

            this._nativeAudioWorkletNode = nativeAudioWorkletNode;
            // Bug #86 & #87: Every browser but Firefox needs to get an unused output which should not be exposed.
            this._numberOfOutputs = (options.numberOfOutputs === 0) ? 0 : this._nativeAudioWorkletNode.numberOfOutputs;
            this._onprocessorerror = null;
            this._parameters = new ReadOnlyMap(parameters);

            /*
             * Bug #86 & #87: Every browser but Firefox needs an output to be connected.
             *
             * Bug #50: Only Edge does not yet allow to create AudioNodes on a closed AudioContext. Therefore this is currently faked by
             * using another AudioContext. And that is the reason why this will fail in case of a closed AudioContext.
             */
            if (context.state !== 'closed') {
                const gainNode = new gainNodeConstructor(context, { gain: 0 });

                try {
                    this
                        .connect(gainNode)
                        .connect(context.destination);
                } catch (err) {
                    if (err.name !== 'IndexSizeError') {
                        throw err;
                    }
                }
            }
        }

        get numberOfOutputs (): number {
            return this._numberOfOutputs;
        }

        get onprocessorerror (): null | TProcessorErrorEventHandler<IAudioWorkletNode<T>> {
            return this._onprocessorerror;
        }

        set onprocessorerror (value) {
            const wrappedListener = (typeof value === 'function')
                ? wrapEventListener(this, <EventListenerOrEventListenerObject> value)
                : null;

            this._nativeAudioWorkletNode.onprocessorerror = wrappedListener;

            const nativeOnProcessorError = this._nativeAudioWorkletNode.onprocessorerror;

            this._onprocessorerror = (nativeOnProcessorError !== null && nativeOnProcessorError === wrappedListener)
                ? value
                : <null | TProcessorErrorEventHandler<IAudioWorkletNode<T>>> nativeOnProcessorError;
        }

        get parameters (): TAudioParamMap {
            if (this._parameters === null) {
                // @todo The definition that TypeScript uses of the AudioParamMap is lacking many methods.
                return <IReadOnlyMap<string, TNativeAudioParam>> this._nativeAudioWorkletNode.parameters;
            }

            return this._parameters;
        }

        get port (): MessagePort {
            return this._nativeAudioWorkletNode.port;
        }

    };

};
