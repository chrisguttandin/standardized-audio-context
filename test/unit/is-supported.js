'use strict';

var di = require('di'),
    isSupportedProvider = require('../../src/is-supported.js').provider,
    Modernizr = require('../../src/modernizr.js').Modernizr;

describe('isSupported', function () {

    var injector,
        tests;

    beforeEach(function () {
        tests = {
            promises: true,
            typedarrays: true,
            webaudio: true
        };

        function FakeModernizr() {
            return tests;
        }

        di.annotate(FakeModernizr, new di.Provide(Modernizr));

        injector = new di.Injector([
            FakeModernizr
        ]);
    });

    it('should return true if all test pass', function () {
        expect(injector.get(isSupportedProvider)).to.be.true;
    });

    it('should return false if the test for promises fails', function () {
        tests.promises = false;

        expect(injector.get(isSupportedProvider)).to.be.false;
    });

    it('should return false if the test for typedarrays fails', function () {
        tests.typedarrays = false;

        expect(injector.get(isSupportedProvider)).to.be.false;
    });

    it('should return false if the test for webaudio fails', function () {
        tests.webaudio = false;

        expect(injector.get(isSupportedProvider)).to.be.false;
    });

});
