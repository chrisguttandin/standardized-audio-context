import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { Injector } from '@angular/core'; // tslint:disable-line:ordered-imports
import { TEST_RESULTS_PROVIDER, testResultsToken } from '../providers/test-results';

const ONGOING_TESTS: Map<object, Promise<boolean>> = new Map();

const injector = Injector.create([
    TEST_RESULTS_PROVIDER
]);

const testResults = injector.get(testResultsToken);

function cacheTestResult (tester: object, test: () => boolean): boolean;
function cacheTestResult (tester: object, test: () => Promise<boolean>): boolean | Promise<boolean>;
function cacheTestResult (tester: object, test: () => boolean | Promise<boolean>): boolean | Promise<boolean> {
    if (testResults.has(tester)) {
        return <boolean> testResults.get(tester);
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
                testResults.set(tester, finalTestResult);

                return finalTestResult;
            });
    }

    testResults.set(tester, synchronousTestResult);

    return synchronousTestResult;
}

export { cacheTestResult };
