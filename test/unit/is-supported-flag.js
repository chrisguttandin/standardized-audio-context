'use strict';

require('reflect-metadata');

var angular = require('angular2/core'),
    isSupportedFlag = require('../../src/is-supported-flag.js').isSupportedFlag,
    modernizr = require('../../src/modernizr.js').modernizr;

describe('isSupportedFlag', function () {

    var fakeModernizr,
        injector;

    beforeEach(function () {
        fakeModernizr = {
            promises: true,
            typedarrays: true,
            webaudio: true
        };

        injector = new angular.Injector.resolveAndCreate([
            angular.provide(isSupportedFlag, { useFactory: isSupportedFlag }),
            angular.provide(modernizr, { useValue: fakeModernizr })
        ]);
    });

    it('should return true if all test pass', function () {
        expect(injector.get(isSupportedFlag)).to.be.true;
    });

    it('should return false if the test for promises fails', function () {
        fakeModernizr.promises = false;

        expect(injector.get(isSupportedFlag)).to.be.false;
    });

    it('should return false if the test for typedarrays fails', function () {
        fakeModernizr.typedarrays = false;

        expect(injector.get(isSupportedFlag)).to.be.false;
    });

    it('should return false if the test for webaudio fails', function () {
        fakeModernizr.webaudio = false;

        expect(injector.get(isSupportedFlag)).to.be.false;
    });

});
