import { TEST_RESULTS } from '../globals';

const ONGOING_TESTS: Map<object, Promise<boolean>> = new Map();

function cacheTestResult (tester: object, test: () => boolean): boolean;
function cacheTestResult (tester: object, test: () => Promise<boolean>): boolean | Promise<boolean>;
function cacheTestResult (tester: object, test: () => boolean | Promise<boolean>): boolean | Promise<boolean> {
    const cachedTestResult = TEST_RESULTS.get(tester);

    if (cachedTestResult !== undefined) {
        return cachedTestResult;
    }

    const ongoingTest = ONGOING_TESTS.get(tester);

    if (ongoingTest !== undefined) {
        return ongoingTest;
    }

    const synchronousTestResult = test();

    if (synchronousTestResult instanceof Promise) {
        ONGOING_TESTS.set(tester, synchronousTestResult);

        return synchronousTestResult
            .then((finalTestResult) => {
                ONGOING_TESTS.delete(tester);
                TEST_RESULTS.set(tester, finalTestResult);

                return finalTestResult;
            });
    }

    TEST_RESULTS.set(tester, synchronousTestResult);

    return synchronousTestResult;
}

export { cacheTestResult };
