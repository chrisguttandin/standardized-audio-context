const TEST_RESULTS: WeakMap<object, boolean> = new WeakMap();

export const cacheTestResult = (tester: object, test: () => boolean | Promise<boolean>) => {
    if (TEST_RESULTS.has(tester)) {
        return TEST_RESULTS.get(tester);
    }

    const testResult = test();
    const preliminaryTestResult = (testResult instanceof Promise) ? false : testResult;

    TEST_RESULTS.set(tester, preliminaryTestResult);

    if (testResult instanceof Promise) {
        testResult.then((finalTestResult) => TEST_RESULTS.set(tester, finalTestResult));
    }

    return preliminaryTestResult;
};
