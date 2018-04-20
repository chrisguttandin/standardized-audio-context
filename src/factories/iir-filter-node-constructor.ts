import { getNativeContext } from '../helpers/get-native-context';
import { IIIRFilterNode, IIIRFilterOptions } from '../interfaces';
import {
    TChannelCountMode,
    TChannelInterpretation,
    TContext,
    TIIRFilterNodeConstructorFactory,
    TNativeIIRFilterNode
} from '../types';
import { wrapIIRFilterNodeGetFrequencyResponseMethod } from '../wrappers/iir-filter-node-get-frequency-response-method';

// The DEFAULT_OPTIONS are only of type Partial<IIIRFilterOptions> because there are no default values for feedback and feedforward.
const DEFAULT_OPTIONS: Partial<AudioNodeOptions> = {
    channelCount: 2,
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers'
};

export const createIIRFilterNodeConstructor: TIIRFilterNodeConstructorFactory = (
    createNativeIIRFilterNode,
    createIIRFilterNodeRenderer,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class IIRFilterNode extends noneAudioDestinationNodeConstructor implements IIIRFilterNode {

        private _nativeIIRFilterNode: TNativeIIRFilterNode;

        constructor (
            context: TContext,
            options: { feedback: IIIRFilterOptions['feedback']; feedforward: IIIRFilterOptions['feedforward'] } & Partial<IIIRFilterOptions>
        ) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IIIRFilterOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeIIRFilterNode = createNativeIIRFilterNode(nativeContext, mergedOptions);
            const iirFilterNodeRenderer = (isNativeOfflineAudioContext(nativeContext)) ?
                createIIRFilterNodeRenderer(mergedOptions.feedback, mergedOptions.feedforward) :
                null;

            super(context, nativeIIRFilterNode, iirFilterNodeRenderer);

            // Bug #23 & #24: FirefoxDeveloper does not throw an InvalidAccessError.
            // @todo Write a test which allows other browsers to remain unpatched.
            wrapIIRFilterNodeGetFrequencyResponseMethod(nativeIIRFilterNode);

            this._nativeIIRFilterNode = nativeIIRFilterNode;
        }

        public getFrequencyResponse (frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array) {
            return this._nativeIIRFilterNode.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
        }

    };

};
