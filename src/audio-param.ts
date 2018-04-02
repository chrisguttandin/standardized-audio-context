import { AUDIO_PARAM_CONTEXT_STORE, AUDIO_PARAM_RENDERER_STORE, AUDIO_PARAM_STORE } from './globals';
import { IAudioParam, IAudioParamOptions, IAudioParamRenderer, IMinimalBaseAudioContext } from './interfaces';
import { AudioParamRenderer } from './renderers/audio-param';
import { TNativeAudioParam } from './types';

export class AudioParam implements IAudioParam {

    private _audioParamRenderer: null | IAudioParamRenderer;

    private _context: IMinimalBaseAudioContext;

    private _maxValue: null | number;

    private _minValue: null | number;

    private _nativeAudioParam: TNativeAudioParam;

    constructor ({ context, isAudioParamOfOfflineAudioContext, maxValue, minValue, nativeAudioParam }: IAudioParamOptions) {
        const audioParamRenderer = (isAudioParamOfOfflineAudioContext) ? new AudioParamRenderer() : null;

        this._audioParamRenderer = audioParamRenderer;
        this._context = context;
        this._maxValue = maxValue;
        this._minValue = minValue;
        this._nativeAudioParam = nativeAudioParam;

        AUDIO_PARAM_CONTEXT_STORE.set(this, context);

        if (audioParamRenderer !== null) {
            AUDIO_PARAM_RENDERER_STORE.set(this, audioParamRenderer);
        }

        AUDIO_PARAM_STORE.set(this, nativeAudioParam);
    }

    get defaultValue () {
        return this._nativeAudioParam.defaultValue;
    }

    get maxValue () {
        if (this._maxValue === null) {
            return this._nativeAudioParam.maxValue;
        }

        return this._maxValue;
    }

    get minValue () {
        if (this._minValue === null) {
            return this._nativeAudioParam.minValue;
        }

        return this._minValue;
    }

    get value () {
        return this._nativeAudioParam.value;
    }

    set value (value) {
        this._nativeAudioParam.value = value;

        if (this._audioParamRenderer !== null) {
            this._audioParamRenderer.record({ startTime: this._context.currentTime, type: 'setValue', value });
        }
    }

    public cancelScheduledValues (cancelTime: number): IAudioParam {
        this._nativeAudioParam.cancelScheduledValues(cancelTime);

        // @todo

        return this;
    }

    public exponentialRampToValueAtTime (value: number, endTime: number): IAudioParam {
        this._nativeAudioParam.exponentialRampToValueAtTime(value, endTime);

        if (this._audioParamRenderer !== null) {
            this._audioParamRenderer.record({ endTime, type: 'exponentialRampToValue', value });
        }

        return this;
    }

    public linearRampToValueAtTime (value: number, endTime: number): IAudioParam {
        this._nativeAudioParam.linearRampToValueAtTime(value, endTime);

        if (this._audioParamRenderer !== null) {
            this._audioParamRenderer.record({ endTime, type: 'linearRampToValue', value });
        }

        return this;
    }

    public setTargetAtTime (target: number, startTime: number, timeConstant: number): IAudioParam {
        this._nativeAudioParam.setTargetAtTime(target, startTime, timeConstant);

        if (this._audioParamRenderer !== null) {
            this._audioParamRenderer.record({ startTime, target, timeConstant, type: 'setTarget' });
        }

        return this;
    }

    public setValueAtTime (value: number, startTime: number): IAudioParam {
        this._nativeAudioParam.setValueAtTime(value, startTime);

        if (this._audioParamRenderer !== null) {
            this._audioParamRenderer.record({ startTime, type: 'setValue', value });
        }

        return this;
    }

    public setValueCurveAtTime (values: Float32Array, startTime: number, duration: number): IAudioParam {
        // @todo TypeScript is expecting values to be an array of numbers.
        this._nativeAudioParam.setValueCurveAtTime(<any> values, startTime, duration);

        if (this._audioParamRenderer !== null) {
            this._audioParamRenderer.record({ duration, startTime, type: 'setValueCurve', values });
        }

        return this;
    }

}
