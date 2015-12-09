'use strict';

var di = require('di'),
    Window = require('../../src/window.js').Window;

describe('Window', function () {

    var injector;

    beforeEach(function () {
        injector = new di.Injector();
    });

    it('should return the global window', function () {
        expect(injector.get(Window)).to.equal(window);
    });

});
