import 'core-js/es7/reflect';
import { IS_SUPPORTED_PROMISE_PROVIDER, isSupportedPromise } from '../../../src/providers/is-supported-promise';
import { AudioContextOptionsSupportTester } from '../../../src/support-testers/audio-context-options';
import { CloseSupportTester } from '../../../src/support-testers/close';
import { DecodeAudioDataTypeErrorSupportTester } from '../../../src/support-testers/decode-audio-data-type-error';
import { MergingSupportTester } from '../../../src/support-testers/merging';
import { ReflectiveInjector } from '@angular/core';
import { modernizr } from '../../../src/providers/modernizr';

describe('isSupportedPromise', () => {

    let fakeAudioContextOptionsSupportTester;
    let fakeCloseSupportTester;
    let fakeDecodeAudioDataTypeErrorSupportTester;
    let fakeMergingSupportTester;
    let fakeModernizr;
    let injector;

    beforeEach(() => {
        fakeAudioContextOptionsSupportTester = {
            test: () => true
        };

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
            { provide: AudioContextOptionsSupportTester, useValue: fakeAudioContextOptionsSupportTester },
            { provide: CloseSupportTester, useValue: fakeCloseSupportTester },
            { provide: DecodeAudioDataTypeErrorSupportTester, useValue: fakeDecodeAudioDataTypeErrorSupportTester },
            { provide: MergingSupportTester, useValue: fakeMergingSupportTester },
            IS_SUPPORTED_PROMISE_PROVIDER,
            { provide: modernizr, useValue: fakeModernizr }
        ]);
    });

    it('should resolve to true if all test pass', () => {
        return injector
            .get(isSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.true);
    });

    it('should resolve to false if the test for AudioContextOptions support fails', () => {
        fakeAudioContextOptionsSupportTester.test = () => false;

        return injector
            .get(isSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.false);
    });

    it('should resolve to false if the test for close support fails', () => {
        fakeCloseSupportTester.test = () => false;

        return injector
            .get(isSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.false);
    });

    it('should resolve to false if the test for decodeAudioData TypeError support fails', () => {
        fakeDecodeAudioDataTypeErrorSupportTester.test = () => Promise.resolve(false);

        return injector
            .get(isSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.false);
    });

    it('should resolve to false if the test for merging support fails', () => {
        fakeMergingSupportTester.test = () => Promise.resolve(false);

        return injector
            .get(isSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.false);
    });

    it('should resolve to false if the test for promises fails', () => {
        fakeModernizr.promises = false;

        return injector
            .get(isSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.false);
    });

    it('should resolve to false if the test for typedarrays fails', () => {
        fakeModernizr.typedarrays = false;

        return injector
            .get(isSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.false);
    });

    it('should resolve to false if the test for webaudio fails', () => {
        fakeModernizr.webaudio = false;

        return injector
            .get(isSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.false);
    });

});
