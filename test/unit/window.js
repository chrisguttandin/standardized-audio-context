'use strict';

var di = require('di'),
    windowProvider = require('../../src/window.js').provider;

describe('window', function () {

    describe('provider', function () {

        var injector;

        beforeEach(function () {
            injector = new di.Injector();
        });

        it('should return the global window', function () {
            expect(injector.get(windowProvider)).to.equal(window);
        });

    });

});
