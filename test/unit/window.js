'use strict';

var wndw = require('../../src/window.js').window;

describe('window', function () {

    it('should return the global window', function () {
        expect(wndw).to.equal(window);
    });

});
