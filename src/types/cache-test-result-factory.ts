import { TCacheTestResultFunction } from './cache-test-result-function';

export type TCacheTestResultFactory = (
    ongoingTests: WeakMap<object, Promise<boolean>>,
    testResults: WeakMap<object, boolean>
) => TCacheTestResultFunction;
