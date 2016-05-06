'use strict';

var mdl = require('../../src/module.js');

describe('module', function () {

    it('should export the AudioContext constructor', function () {
        expect(mdl.AudioContext).to.be.a('function');
    });

    it('should export the isSupported promise', function () {
        expect(mdl.isSupported).to.be.an.instanceof(Promise);
    });

    it('should export the OfflineAudioContext constructor', function () {
        expect(mdl.OfflineAudioContext).to.be.a('function');
    });

});
