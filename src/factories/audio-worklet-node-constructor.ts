import { createInvalidStateError } from '../factories/invalid-state-error';
import { createNotSupportedError } from '../factories/not-supported-error';
import { createNativeAudioWorkletNodeFaker } from '../fakers/audio-worklet-node';
import { AUDIO_NODE_RENDERER_STORE, NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS } from '../globals';
import { getNativeContext } from '../helpers/get-native-context';
import {
    IAudioParam,
    IAudioWorkletNode,
    IAudioWorkletNodeOptions,
    IAudioWorkletProcessorConstructor,
    IMinimalBaseAudioContext,
    INativeAudioWorkletNode,
    INativeAudioWorkletNodeConstructor
} from '../interfaces';
import { ReadOnlyMap } from '../read-only-map';
import {
    TAudioParamMap,
    TAudioWorkletNodeConstructorFactory,
    TChannelCountMode,
    TChannelInterpretation,
    TProcessorErrorEventHandler,
    TUnpatchedAudioContext,
    TUnpatchedOfflineAudioContext
} from '../types';

const DEFAULT_OPTIONS: IAudioWorkletNodeOptions = {
    channelCount: 2,
    // Bug #61: The channelCountMode should be 'max' according to the spec but is set to 'explicit' to achieve consistent behavior.
    channelCountMode: <TChannelCountMode> 'explicit',
    channelInterpretation: <TChannelInterpretation> 'speakers',
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

const createNativeAudioWorkletNode = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    nativeAudioWorkletNodeConstructor: null | INativeAudioWorkletNodeConstructor,
    name: string,
    processorDefinition: undefined | IAudioWorkletProcessorConstructor,
    options: { outputChannelCount: number[] } & IAudioWorkletNodeOptions
) => {
    if (nativeAudioWorkletNodeConstructor !== null) {
        try {
            const nativeNode = new nativeAudioWorkletNodeConstructor(nativeContext, name, options);

            /*
             * Bug #61: Overwriting the property accessors is necessary as long as some browsers have no native implementation to achieve a
             * consistent behavior.
             */
            Object.defineProperties(nativeNode, {
                channelCount: {
                    get: () => options.channelCount,
                    set: () => {
                        throw createInvalidStateError();
                    }
                },
                channelCountMode: {
                    get: () => 'explicit',
                    set: () => {
                        throw createInvalidStateError();
                    }
                }
            });

            return nativeNode;
        } catch (err) {
            // Bug #60: Chrome Canary throws an InvalidStateError instead of a NotSupportedError.
            if (err.code === 11 && nativeContext.state !== 'closed') {
                throw createNotSupportedError();
            }

            throw err;
        }
    }

    // Bug #61: Only Chrome Canary has an implementation of the AudioWorkletNode yet.
    if (processorDefinition === undefined) {
        throw createNotSupportedError();
    }

    return createNativeAudioWorkletNodeFaker(nativeContext, processorDefinition, options);
};

export const createAudioWorkletNodeConstructor: TAudioWorkletNodeConstructorFactory = (
    audioWorkletNodeRendererConstructor,
    createAudioParam,
    isNativeOfflineAudioContext,
    nativeAudioWorkletNodeConstructor,
    noneAudioDestinationNodeConstructor
) => {

    return class AudioWorkletNode extends noneAudioDestinationNodeConstructor implements IAudioWorkletNode {

        private _nativeNode: INativeAudioWorkletNode;

        private _parameters: null | TAudioParamMap;

        constructor (context: IMinimalBaseAudioContext, name: string, options: IAudioWorkletNodeOptions = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = sanitizedOptions(<IAudioWorkletNodeOptions> { ...DEFAULT_OPTIONS, ...options });
            const nodeNameToProcessorDefinitionMap = NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS.get(nativeContext);
            const processorDefinition = (nodeNameToProcessorDefinitionMap === undefined) ?
                undefined :
                nodeNameToProcessorDefinitionMap.get(name);
            const nativeNode = createNativeAudioWorkletNode(
                nativeContext,
                nativeAudioWorkletNodeConstructor,
                name,
                processorDefinition,
                mergedOptions
            );
            const isOffline = isNativeOfflineAudioContext(nativeContext);

            super(context, nativeNode);

            this._nativeNode = nativeNode;

            const parameters: [ string, IAudioParam ][] = [ ];

            nativeNode.parameters.forEach((nativeAudioParam, nm) => {
                const audioParam = createAudioParam(context, isOffline, nativeAudioParam);

                parameters.push([ nm, audioParam ]);
            });

            this._parameters = new ReadOnlyMap(parameters);

            if (isOffline) {
                const audioWorkletNodeRenderer = new audioWorkletNodeRendererConstructor(this, name, mergedOptions, processorDefinition);

                AUDIO_NODE_RENDERER_STORE.set(this, audioWorkletNodeRenderer);
            }
        }

        public get onprocessorerror () {
            return <TProcessorErrorEventHandler> (<any> this._nativeNode.onprocessorerror);
        }

        public set onprocessorerror (value) {
            this._nativeNode.onprocessorerror = <any> value;
        }

        get parameters (): TAudioParamMap {
            if (this._parameters === null) {
                return <TAudioParamMap> (<any> this._nativeNode.parameters);
            }

            return this._parameters;
        }

        get port () {
            return this._nativeNode.port;
        }

    };

};
