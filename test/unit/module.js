'use strict';

var di = require('di'),
    mdl = require('../../src/module.js');

describe('module', function () {

    var injector;

    beforeEach(function () {
        injector = new di.Injector();
    });

    it('should export the AudioContext constructor', function () {
        expect(mdl.AudioContext).to.be.a.function;
    });

    it('should export the isSupported flag', function () {
        expect(mdl.isSupported).to.be.a.boolean;
    });

});
