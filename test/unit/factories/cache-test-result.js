import { beforeEach, describe, expect, it } from 'vitest';
import { spy, stub } from 'sinon';
import { createCacheTestResult } from '../../../src/factories/cache-test-result';

describe('createCacheTestResult()', () => {
    let cacheTestResult;
    let ongoingTests;
    let testResults;

    beforeEach(() => {
        ongoingTests = new Map();
        testResults = new WeakMap();
        cacheTestResult = createCacheTestResult(ongoingTests, testResults);
    });

    describe('with a cached test result', () => {
        let fakeTest;
        let fakeTestResult;

        beforeEach(() => {
            fakeTest = spy();
            fakeTestResult = 'fake test result';

            testResults.set(fakeTest, fakeTestResult);
        });

        it('should return the cached test result', () => {
            expect(cacheTestResult(fakeTest, () => fakeTest())).to.equal(fakeTestResult);

            expect(fakeTest).to.have.not.been.called;
        });
    });

    describe('without a cached test result', () => {
        describe('with an ongoing test', () => {
            let fakeOngoingTest;
            let fakeTest;

            beforeEach(() => {
                fakeOngoingTest = 'fake ongoing test';
                fakeTest = spy();

                testResults.set(fakeTest, fakeOngoingTest);
            });

            it('should return the ongoing test', () => {
                expect(cacheTestResult(fakeTest, () => fakeTest())).to.equal(fakeOngoingTest);

                expect(fakeTest).to.have.not.been.called;
            });
        });

        describe('without any ongoing test', () => {
            describe('with a synchronous test result', () => {
                let fakeSynchronousTestResult;
                let fakeTest;

                beforeEach(() => {
                    fakeSynchronousTestResult = 'fake synchronous test result';
                    fakeTest = stub();

                    fakeTest.returns(fakeSynchronousTestResult);
                });

                it('should return the test result', () => {
                    expect(cacheTestResult(fakeTest, () => fakeTest())).to.equal(fakeSynchronousTestResult);

                    expect(fakeTest).to.have.been.calledOnce;
                });
            });

            describe('with a failing synchronous test', () => {
                let fakeTest;

                beforeEach(() => {
                    fakeTest = stub();

                    fakeTest.throws(new Error('a fake error'));
                });

                it('should return the test result', () => {
                    expect(cacheTestResult(fakeTest, () => fakeTest())).to.be.false;

                    expect(fakeTest).to.have.been.calledOnce;
                });
            });

            describe('with an asynchronous test result', () => {
                let fakeAsynchronousTestResult;
                let fakeTest;

                beforeEach(() => {
                    fakeAsynchronousTestResult = 'fake asynchronous test result';
                    fakeTest = stub();

                    fakeTest.resolves(fakeAsynchronousTestResult);
                });

                it('should return a promise which resolves to the test result', async () => {
                    const testResult = cacheTestResult(fakeTest, () => fakeTest());

                    expect(testResult).to.be.an.instanceOf(Promise);
                    expect(await testResult).to.equal(fakeAsynchronousTestResult);

                    expect(fakeTest).to.have.been.calledOnce;
                });
            });

            describe('with a failing asynchronous test', () => {
                let fakeTest;

                beforeEach(() => {
                    fakeTest = stub();

                    fakeTest.rejects(new Error('a fake error'));
                });

                it('should return false', async () => {
                    const testResult = cacheTestResult(fakeTest, () => fakeTest());

                    expect(testResult).to.be.an.instanceOf(Promise);
                    expect(await testResult).to.be.false;

                    expect(fakeTest).to.have.been.calledOnce;
                });
            });
        });
    });
});
