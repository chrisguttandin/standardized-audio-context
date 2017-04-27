import 'core-js/es7/reflect';
import { IS_SUPPORTED_PROMISE_PROVIDER, IsSupportedPromise } from '../../../src/providers/is-supported-promise';
import { CloseSupportTester } from '../../../src/testers/close-support';
import { DecodeAudioDataTypeErrorSupportTester } from '../../../src/testers/decode-audio-data-type-error-support';
import { MergingSupportTester } from '../../../src/testers/merging-support';
import { Modernizr } from '../../../src/providers/modernizr';
import { ReflectiveInjector } from '@angular/core';

describe('isSupportedPromise', () => {

    let fakeCloseSupportTester;
    let fakeDecodeAudioDataTypeErrorSupportTester;
    let fakeMergingSupportTester;
    let fakeModernizr;
    let injector;

    beforeEach(() => {
        fakeCloseSupportTester = {
            test: () => true
        };

        fakeDecodeAudioDataTypeErrorSupportTester = {
            test: () => Promise.resolve(true)
        };

        fakeMergingSupportTester = {
            test: () => Promise.resolve(true)
        };

        fakeModernizr = {
            promises: true,
            typedarrays: true,
            webaudio: true
        };

        injector = ReflectiveInjector.resolveAndCreate([
            { provide: CloseSupportTester, useValue: fakeCloseSupportTester },
            { provide: DecodeAudioDataTypeErrorSupportTester, useValue: fakeDecodeAudioDataTypeErrorSupportTester },
            { provide: MergingSupportTester, useValue: fakeMergingSupportTester },
            IS_SUPPORTED_PROMISE_PROVIDER,
            { provide: Modernizr, useValue: fakeModernizr }
        ]);
    });

    it('should resolve to true if all test pass', () => {
        return injector
            .get(IsSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.true);
    });

    it('should resolve to false if the test for close support fails', () => {
        fakeCloseSupportTester.test = () => false;

        return injector
            .get(IsSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.false);
    });

    it('should resolve to false if the test for decodeAudioData TypeError support fails', () => {
        fakeDecodeAudioDataTypeErrorSupportTester.test = () => Promise.resolve(false);

        return injector
            .get(IsSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.false);
    });

    it('should resolve to false if the test for merging support fails', () => {
        fakeMergingSupportTester.test = () => Promise.resolve(false);

        return injector
            .get(IsSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.false);
    });

    it('should resolve to false if the test for promises fails', () => {
        fakeModernizr.promises = false;

        return injector
            .get(IsSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.false);
    });

    it('should resolve to false if the test for typedarrays fails', () => {
        fakeModernizr.typedarrays = false;

        return injector
            .get(IsSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.false);
    });

    it('should resolve to false if the test for webaudio fails', () => {
        fakeModernizr.webaudio = false;

        return injector
            .get(IsSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.false);
    });

});
