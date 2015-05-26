'use strict';

var di = require('di'),
    Modernizr = require('../../lib/modernizr.js'),
    modernizrProvider = require('../../src/modernizr.js').provider;

describe('modernizr', function () {

    describe('provider', function () {

        var injector;

        beforeEach(function () {
            injector = new di.Injector();
        });

        it('should return the Modernizr singleton', function () {
            expect(injector.get(modernizrProvider)).to.equal(Modernizr);
        });

    });

});
