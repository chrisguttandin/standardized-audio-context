import { IAudioParam } from './audio-param';

export interface IAudioParamMap {

    readonly entries: Map<string, IAudioParam>['entries'];

    readonly forEach: Map<string, IAudioParam>['forEach'];

    readonly get: Map<string, IAudioParam>['get'];

    readonly has: Map<string, IAudioParam>['has'];

    readonly keys: Map<string, IAudioParam>['keys'];

    readonly values: Map<string, IAudioParam>['values'];

    // @todo Symbol.iterator

}
