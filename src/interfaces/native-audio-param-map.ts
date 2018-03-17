import { TNativeAudioParam } from '../types';

// @todo Since there are no native types yet they need to be crafted.
export interface INativeAudioParamMap {

    readonly entries: Map<string, TNativeAudioParam>['entries'];

    readonly forEach: Map<string, TNativeAudioParam>['forEach'];

    readonly get: Map<string, TNativeAudioParam>['get'];

    readonly has: Map<string, TNativeAudioParam>['has'];

    readonly keys: Map<string, TNativeAudioParam>['keys'];

    readonly values: Map<string, TNativeAudioParam>['values'];

    // @todo Symbol.iterator

}
