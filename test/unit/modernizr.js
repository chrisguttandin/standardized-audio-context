'use strict';

var modernizr = require('../../src/modernizr.js').modernizr;

describe('modernizr', function () {

    it('should contain the result of the promises test', function () {
        expect(modernizr.promises).to.be.a('boolean');
    });

    it('should contain the result of the typedarrays test', function () {
        expect(modernizr.typedarrays).to.be.a('boolean');
    });

    it('should contain the result of the webaudio test', function () {
        expect(modernizr.webaudio).to.be.a('boolean');
    });

});
