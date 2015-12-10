'use strict';

var browsernizr = require('browsernizr'),
    modernizr = require('../../src/modernizr.js').modernizr;

describe('modernizr', function () {

    it('should return the browsernizr singleton', function () {
        expect(modernizr).to.equal(browsernizr);
    });

});
