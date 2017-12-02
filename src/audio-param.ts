import { IAudioParam, IAudioParamOptions, IAudioParamRenderer } from './interfaces';
import { TNativeAudioParam } from './types';

export class AudioParam implements IAudioParam {

    private _nativeAudioParam: null | TNativeAudioParam;

    private _audioParamRenderer: IAudioParamRenderer;

    constructor ({ audioParamRenderer, nativeAudioParam }: IAudioParamOptions) {
        this._audioParamRenderer = audioParamRenderer;
        this._nativeAudioParam = (nativeAudioParam === undefined) ? null : nativeAudioParam;
    }

    get defaultValue () {
        if (this._nativeAudioParam !== null) {
            return this._nativeAudioParam.defaultValue;
        }

        throw new Error('Not yet implemented.');
    }

    get maxValue () {
        if (this._nativeAudioParam !== null) {
            // @todo TypeScript does not yet know about the maxValue property.
            return (<any> this._nativeAudioParam).maxValue;
        }

        throw new Error('Not yet implemented.');
    }

    get minValue () {
        if (this._nativeAudioParam !== null) {
            // @todo TypeScript does not yet know about the minValue property.
            return (<any> this._nativeAudioParam).minValue;
        }

        throw new Error('Not yet implemented.');
    }

    get value () {
        if (this._nativeAudioParam !== null) {
            return this._nativeAudioParam.value;
        }

        throw new Error('Not yet implemented.');
    }

    set value (value) {
        if (this._nativeAudioParam !== null) {
            this._nativeAudioParam.value = value;
        }

        // @todo Retrieve startTime from the (Offline)AudioContext.
        this._audioParamRenderer.record({ startTime: 0, type: 'setValue', value });
    }

    public cancelAndHoldAtTime (cancelTime: number) {
        if (this._nativeAudioParam !== null) {
            // @todo TypeScript does not yet know about the cancelAndHoldAtTime() method.
            (<any> this._nativeAudioParam).cancelAndHoldAtTime(cancelTime);
        }

        // @todo
    }

    public cancelScheduledValues (cancelTime: number) {
        if (this._nativeAudioParam !== null) {
            this._nativeAudioParam.cancelScheduledValues(cancelTime);
        }

        // @todo
    }

    public exponentialRampToValueAtTime (value: number, endTime: number) {
        if (this._nativeAudioParam !== null) {
            this._nativeAudioParam.exponentialRampToValueAtTime(value, endTime);
        }

        this._audioParamRenderer.record({ endTime, type: 'exponentialRampToValue', value });
    }

    public linearRampToValueAtTime (value: number, endTime: number) {
        if (this._nativeAudioParam !== null) {
            this._nativeAudioParam.linearRampToValueAtTime(value, endTime);
        }

        this._audioParamRenderer.record({ endTime, type: 'linearRampToValue', value });
    }

    public setTargetAtTime (target: number, startTime: number, timeConstant: number) {
        if (this._nativeAudioParam !== null) {
            this._nativeAudioParam.setTargetAtTime(target, startTime, timeConstant);
        }

        this._audioParamRenderer.record({ startTime, target, timeConstant, type: 'setTarget' });
    }

    public setValueAtTime (value: number, startTime: number) {
        if (this._nativeAudioParam !== null) {
            this._nativeAudioParam.setValueAtTime(value, startTime);
        }

        this._audioParamRenderer.record({ startTime, type: 'setValue', value });
    }

    public setValueCurveAtTime (values: Float32Array, startTime: number, duration: number) {
        if (this._nativeAudioParam !== null) {
            this._nativeAudioParam.setValueCurveAtTime(values, startTime, duration);
        }

        this._audioParamRenderer.record({ duration, startTime, type: 'setValueCurve', values });
    }

}
