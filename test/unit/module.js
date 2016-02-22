'use strict';

var mdl = require('../../src/module.js');

describe('module', function () {

    it('should export the AudioContext constructor', function () {
        expect(mdl.AudioContext).to.be.a.function;
    });

    it('should export the isSupported flag', function () {
        expect(mdl.isSupported).to.be.a.boolean;
    });

    it('should export the OfflineAudioContext constructor', function () {
        expect(mdl.OfflineAudioContext).to.be.a.function;
    });

});
