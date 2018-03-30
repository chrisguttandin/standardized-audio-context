export interface IAudioParam {

    readonly defaultValue: number;

    readonly maxValue: number;

    readonly minValue: number;

    value: number;

    /*
     * Bug #28: Edge, Firefox & Safari do not yet implement cancelAndHoldAtTime().
     * cancelAndHoldAtTime (cancelTime: number): void;
     */

    cancelScheduledValues (cancelTime: number): void;

    exponentialRampToValueAtTime (value: number, endTime: number): void;

    linearRampToValueAtTime (value: number, endTime: number): void;

    setTargetAtTime (target: number, startTime: number, timeConstant: number): void;

    setValueAtTime (value: number, startTime: number): void;

    setValueCurveAtTime (values: Float32Array, startTime: number, duration: number): void;

}
