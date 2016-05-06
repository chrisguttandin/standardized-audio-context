'use strict';

require('reflect-metadata');

var angular = require('@angular/core'),
    isSupportedPromise = require('../../src/is-supported-promise.js').isSupportedPromise,
    modernizr = require('../../src/modernizr.js').modernizr;

describe('isSupportedPromise', function () {

    var fakeModernizr,
        injector;

    beforeEach(function () {
        fakeModernizr = {
            promises: true,
            typedarrays: true,
            webaudio: true
        };

        injector = angular.ReflectiveInjector.resolveAndCreate([
            angular.provide(isSupportedPromise, { useFactory: isSupportedPromise }),
            angular.provide(modernizr, { useValue: fakeModernizr })
        ]);
    });

    it('should resolve to true if all test pass', function () {
        return injector
            .get(isSupportedPromise)
            .then((isSupported) => expect(isSupported).to.be.true);
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
