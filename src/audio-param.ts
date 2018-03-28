import { AUDIO_PARAM_CONTEXT_STORE, AUDIO_PARAM_STORE } from './globals';
import { IAudioParam, IAudioParamOptions, IAudioParamRenderer, IMinimalBaseAudioContext } from './interfaces';
import { TNativeAudioParam } from './types';

export class AudioParam implements IAudioParam {

    private _context: IMinimalBaseAudioContext;

    private _nativeAudioParam: TNativeAudioParam;

    private _audioParamRenderer: IAudioParamRenderer;

    constructor ({ audioParamRenderer, context, nativeAudioParam }: IAudioParamOptions) {
        this._audioParamRenderer = audioParamRenderer;
        this._context = context;
        this._nativeAudioParam = nativeAudioParam;

        AUDIO_PARAM_CONTEXT_STORE.set(this, context);
        AUDIO_PARAM_STORE.set(this, nativeAudioParam);
    }

    get defaultValue () {
        return this._nativeAudioParam.defaultValue;
    }

    get maxValue () {
        // @todo TypeScript does not yet know about the maxValue property.
        return (<any> this._nativeAudioParam).maxValue;
    }

    get minValue () {
        // @todo TypeScript does not yet know about the minValue property.
        return (<any> this._nativeAudioParam).minValue;
    }

    get value () {
        return this._nativeAudioParam.value;
    }

    set value (value) {
        this._nativeAudioParam.value = value;
        this._audioParamRenderer.record({ startTime: this._context.currentTime, type: 'setValue', value });
    }

    public cancelAndHoldAtTime (cancelTime: number) {
        (<any> this._nativeAudioParam).cancelAndHoldAtTime(cancelTime);

        // @todo
    }

    public cancelScheduledValues (cancelTime: number) {
        this._nativeAudioParam.cancelScheduledValues(cancelTime);

        // @todo
    }

    public exponentialRampToValueAtTime (value: number, endTime: number) {
        this._nativeAudioParam.exponentialRampToValueAtTime(value, endTime);
        this._audioParamRenderer.record({ endTime, type: 'exponentialRampToValue', value });
    }

    public linearRampToValueAtTime (value: number, endTime: number) {
        this._nativeAudioParam.linearRampToValueAtTime(value, endTime);
        this._audioParamRenderer.record({ endTime, type: 'linearRampToValue', value });
    }

    public setTargetAtTime (target: number, startTime: number, timeConstant: number) {
        this._nativeAudioParam.setTargetAtTime(target, startTime, timeConstant);
        this._audioParamRenderer.record({ startTime, target, timeConstant, type: 'setTarget' });
    }

    public setValueAtTime (value: number, startTime: number) {
        this._nativeAudioParam.setValueAtTime(value, startTime);
        this._audioParamRenderer.record({ startTime, type: 'setValue', value });
    }

    public setValueCurveAtTime (values: Float32Array, startTime: number, duration: number) {
        // @todo TypeScript is expecting values to be an array of numbers.
        this._nativeAudioParam.setValueCurveAtTime(<any> values, startTime, duration);
        this._audioParamRenderer.record({ duration, startTime, type: 'setValueCurve', values });
    }

}
