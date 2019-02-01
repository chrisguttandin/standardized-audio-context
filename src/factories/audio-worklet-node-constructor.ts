import { NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS } from '../globals';
import { getNativeContext } from '../helpers/get-native-context';
import { wrapEventListener } from '../helpers/wrap-event-listener';
import {
    IAudioContext,
    IAudioParam,
    IAudioWorkletNode,
    IAudioWorkletNodeOptions,
    IMinimalAudioContext,
    IReadOnlyMap
} from '../interfaces';
import { ReadOnlyMap } from '../read-only-map';
import {
    TAudioParamMap,
    TAudioWorkletNodeConstructorFactory,
    TContext,
    TNativeAudioParam,
    TNativeAudioWorkletNode,
    TProcessorErrorEventHandler
} from '../types';

const DEFAULT_OPTIONS: IAudioWorkletNodeOptions = {
    channelCount: 2,
    // Bug #61: The channelCountMode should be 'max' according to the spec but is set to 'explicit' to achieve consistent behavior.
    channelCountMode: 'explicit',
    channelInterpretation: 'speakers',
    numberOfInputs: 1,
    numberOfOutputs: 1,
    outputChannelCount: undefined,
    parameterData: { },
    processorOptions: null
};

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
                createChannelCount(options.numberOfOutputs),
        // Bug #66: The default value of processorOptions should be null, but Chrome Canary doesn't like it.
        processorOptions: (options.processorOptions === null) ? { } : options.processorOptions
    };
};

export const createAudioWorkletNodeConstructor: TAudioWorkletNodeConstructorFactory = (
    createAudioParam,
    createAudioWorkletNodeRenderer,
    createNativeAudioWorkletNode,
    gainNodeConstructor,
    isNativeOfflineAudioContext,
    nativeAudioWorkletNodeConstructor,
    noneAudioDestinationNodeConstructor
) => {

    return class AudioWorkletNode extends noneAudioDestinationNodeConstructor implements IAudioWorkletNode {

        private _nativeAudioWorkletNode: TNativeAudioWorkletNode;

        private _numberOfOutputs: number;

        private _onprocessorerror: null | TProcessorErrorEventHandler;

        private _parameters: null | TAudioParamMap;

        constructor (context: TContext, name: string, options: Partial<IAudioWorkletNodeOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const mergedOptions = sanitizedOptions({ ...DEFAULT_OPTIONS, ...options });
            const nodeNameToProcessorDefinitionMap = NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS.get(nativeContext);
            const processorDefinition = (nodeNameToProcessorDefinitionMap === undefined) ?
                undefined :
                nodeNameToProcessorDefinitionMap.get(name);
            const nativeAudioWorkletNode = createNativeAudioWorkletNode(
                nativeContext,
                isOffline ? null : (<IAudioContext | IMinimalAudioContext> context).baseLatency,
                nativeAudioWorkletNodeConstructor,
                name,
                processorDefinition,
                mergedOptions
            );
            const audioWorkletNodeRenderer = (isOffline) ?
                createAudioWorkletNodeRenderer(name, mergedOptions, processorDefinition) :
                null;

            super(context, nativeAudioWorkletNode, audioWorkletNodeRenderer);

            const parameters: [ string, IAudioParam ][] = [ ];

            nativeAudioWorkletNode.parameters.forEach((nativeAudioParam, nm) => {
                const audioParam = createAudioParam(context, isOffline, nativeAudioParam);

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
             * Bug #50: Only Safari does yet allow to create AudioNodes on a closed AudioContext. Therefore this is currently faked by
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
                        throw err; // tslint:disable-line:rxjs-throw-error
                    }
                }
            }
        }

        get numberOfOutputs (): number {
            return this._numberOfOutputs;
        }

        get onprocessorerror (): null | TProcessorErrorEventHandler {
            return this._onprocessorerror;
        }

        set onprocessorerror (value) {
            const wrappedListener = <TNativeAudioWorkletNode['onprocessorerror']> wrapEventListener(this, value);

            this._nativeAudioWorkletNode.onprocessorerror = wrappedListener;

            const nativeOnProcessorError = <null | TProcessorErrorEventHandler> this._nativeAudioWorkletNode.onprocessorerror;

            this._onprocessorerror = (nativeOnProcessorError === wrappedListener) ? value : nativeOnProcessorError;
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
