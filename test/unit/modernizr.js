'use strict';

var di = require('di'),
    modernizr = require('browsernizr'),
    Modernizr = require('../../src/modernizr.js').Modernizr;

describe('Modernizr', function () {

    var injector;

    beforeEach(function () {
        injector = new di.Injector();
    });

    it('should return the Modernizr singleton', function () {
        expect(injector.get(Modernizr)).to.equal(modernizr);
    });

});
