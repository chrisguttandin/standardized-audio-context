import { TCacheTestResultFactory } from '../types';

export const createCacheTestResult: TCacheTestResultFactory = (ongoingTests, testResults) => {
    return (tester, test) => {
        const cachedTestResult = testResults.get(tester);

        if (cachedTestResult !== undefined) {
            return cachedTestResult;
        }

        const ongoingTest = ongoingTests.get(tester);

        if (ongoingTest !== undefined) {
            return ongoingTest;
        }

        try {
            const synchronousTestResult = test();

            if (synchronousTestResult instanceof Promise) {
                const promise = synchronousTestResult.catch(() => false);

                ongoingTests.set(tester, promise);

                promise.then((asynchronousTestResult) => {
                    ongoingTests.delete(tester);
                    testResults.set(tester, asynchronousTestResult);
                });

                return promise;
            }

            testResults.set(tester, synchronousTestResult);

            return synchronousTestResult;
        } catch {
            testResults.set(tester, false);

            return false;
        }
    };
};
