const TEST_RESULTS: WeakMap<object, boolean> = new WeakMap();
const ONGOING_TESTS: Map<object, Promise<boolean>> = new Map();

function cacheTestResult (tester: object, test: () => boolean): boolean;
function cacheTestResult (tester: object, test: () => Promise<boolean>): boolean | Promise<boolean>;
function cacheTestResult (tester: object, test: () => boolean | Promise<boolean>): boolean | Promise<boolean> {
    if (TEST_RESULTS.has(tester)) {
        return <boolean> TEST_RESULTS.get(tester);
    }

    if (ONGOING_TESTS.has(tester)) {
        return <Promise<boolean>> ONGOING_TESTS.get(tester);
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
