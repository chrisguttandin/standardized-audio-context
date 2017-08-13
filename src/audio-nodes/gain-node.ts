import { RENDERER_STORE } from '../globals';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IGainNode, IGainOptions, IMinimalBaseAudioContext } from '../interfaces';
import { GainNodeRenderer } from '../renderers/gain-node';
import { TChannelCountMode, TChannelInterpretation, TNativeGainNode } from '../types';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const DEFAULT_OPTIONS: IGainOptions = {
    channelCount: 2, // @todo channelCount is not specified because it is ignored when the channelCountMode equals 'max'.
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    gain: 1,
    numberOfInputs: 1,
    numberOfOutputs: 1
};

export class GainNode extends NoneAudioDestinationNode implements IGainNode {

    constructor (context: IMinimalBaseAudioContext, options: Partial<IGainOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IGainOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = isOfflineAudioContext(nativeContext) ? null : nativeContext.createGain();

        super(context, nativeNode, mergedOptions);

        if (nativeNode === null) {
            const gainNodeRenderer = new GainNodeRenderer(this);

            RENDERER_STORE.set(this, gainNodeRenderer);
        }
    }

    public get gain (): AudioParam {
        if (this._nativeNode !== null) {
            return (<TNativeGainNode> this._nativeNode).gain;
        }

        // @todo Fake a proper AudioParam.
        const audioParam = {
            cancelScheduledValues: (startTime: number) => {
                startTime; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            defaultValue: 1,
            exponentialRampToValueAtTime: (value: number, endTime: number) => {
                endTime; // tslint:disable-line:no-unused-expression
                value; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            linearRampToValueAtTime: (value: number, endTime: number) => {
                endTime; // tslint:disable-line:no-unused-expression
                value; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            setTargetAtTime: (target: number, startTime: number, timeConstant: number) => {
                startTime; // tslint:disable-line:no-unused-expression
                target; // tslint:disable-line:no-unused-expression
                timeConstant; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            setValueAtTime: (value: number, startTime: number) => {
                startTime; // tslint:disable-line:no-unused-expression
                value; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            setValueCurveAtTime: (values: Float32Array, startTime: number, duration: number) => {
                duration; // tslint:disable-line:no-unused-expression
                startTime; // tslint:disable-line:no-unused-expression
                values; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            value: 1
        };

        return audioParam;
    }

}
