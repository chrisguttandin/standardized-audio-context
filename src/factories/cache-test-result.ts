import { TEST_RESULTS } from '../globals';
import { TCacheTestResultFactory } from '../types';

export const createCacheTestResult: TCacheTestResultFactory = (ongoingTests) => {
    return (tester, test) => {
        const cachedTestResult = TEST_RESULTS.get(tester);

        if (cachedTestResult !== undefined) {
            return cachedTestResult;
        }

        const ongoingTest = ongoingTests.get(tester);

        if (ongoingTest !== undefined) {
            return ongoingTest;
        }

        const synchronousTestResult = test();

        if (synchronousTestResult instanceof Promise) {
            ongoingTests.set(tester, synchronousTestResult);

            return synchronousTestResult
                .then((finalTestResult) => {
                    ongoingTests.delete(tester);
                    TEST_RESULTS.set(tester, finalTestResult);

                    return finalTestResult;
                });
        }

        TEST_RESULTS.set(tester, synchronousTestResult);

        return synchronousTestResult;
    };
};
