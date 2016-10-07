import 'reflect-metadata';
import { DecodeAudioDataTypeErrorSupportTester } from '../../src/tester/decode-audio-data-type-error-support';
import { MergingSupportTester } from '../../src/tester/merging-support';
import { ReflectiveInjector } from '@angular/core';
import { isSupportedPromise } from '../../src/is-supported-promise';
import { modernizr } from '../../src/modernizr';

describe('isSupportedPromise', function () {

    var fakeDecodeAudioDataTypeErrorSupportTester,
        fakeMergingSupportTester,
        fakeModernizr,
        injector;

    beforeEach(function () {
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
            { provide: DecodeAudioDataTypeErrorSupportTester, useValue: fakeDecodeAudioDataTypeErrorSupportTester },
            { provide: MergingSupportTester, useValue: fakeMergingSupportTester },
            { provide: isSupportedPromise, useFactory: isSupportedPromise },
            { provide: modernizr, useValue: fakeModernizr }
        ]);
    });

    it('should resolve to true if all test pass', function () {
        return injector
            .get(isSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.true);
    });

    // it('should resolve to false if the test for decodeAudioData TypeError support fails', function () {
    //     fakeDecodeAudioDataTypeErrorSupportTester.test = () => Promise.resolve(false);
    //
    //     return injector
    //         .get(isSupportedPromise)
    //         .then((isSupported) => expect(isSupported).to.be.false);
    // });

    it('should resolve to false if the test for merging support fails', function () {
        fakeMergingSupportTester.test = () => Promise.resolve(false);

        return injector
            .get(isSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.false);
    });

    it('should resolve to false if the test for promises fails', function () {
        fakeModernizr.promises = false;

        return injector
            .get(isSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.false);
    });

    it('should resolve to false if the test for typedarrays fails', function () {
        fakeModernizr.typedarrays = false;

        return injector
            .get(isSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.false);
    });

    it('should resolve to false if the test for webaudio fails', function () {
        fakeModernizr.webaudio = false;

        return injector
            .get(isSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.false);
    });

});
