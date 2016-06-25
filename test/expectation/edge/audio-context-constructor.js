import 'reflect-metadata';
import { ReflectiveInjector } from '@angular/core';
import { unpatchedAudioContextConstructor } from '../../../../src/unpatched-audio-context-constructor';
import { window as wndw } from '../../../../src/window';

describe('audioContextConstructor', function () {

    var audioContext,
        AudioContext;

    beforeEach(function () {
        /* eslint-disable indent */
        var injector = ReflectiveInjector.resolveAndCreate([
                { provide: unpatchedAudioContextConstructor, useFactory: unpatchedAudioContextConstructor },
                { provide: wndw, useValue: window }
            ]);
        /* eslint-enable indent */

        AudioContext = injector.get(unpatchedAudioContextConstructor);

        audioContext = new AudioContext();
    });

    describe('close()', function () {

        // bug #10

        it('should not be implemented', function () {
            expect(audioContext.close).to.be.undefined;
        });

    });

    describe('createBufferSource()', function () {

        // bug #11

        it('should not be chainable', function () {
            var audioBufferSourceNode = audioContext.createBufferSource(),
                gainNode = audioContext.createGain();

            expect(audioBufferSourceNode.connect(gainNode)).to.be.undefined;
        });

    });

    describe('createChannelMerger()', function () {

        // bug #11

        it('should not be chainable', function () {
            var channelMergerNode = audioContext.createChannelMerger(),
                gainNode = audioContext.createGain();

            expect(channelMergerNode.connect(gainNode)).to.be.undefined;
        });

    });

    describe('createGain()', function () {

        // bug #11

        it('should not be chainable', function () {
            var gainNodeA = audioContext.createGain(),
                gainNodeB = audioContext.createGain();

            expect(gainNodeA.connect(gainNodeB)).to.be.undefined;
        });

    });

    describe('createIIRFilter()', function () {

        // bug #9

        it('should not be implemented', function () {
            expect(audioContext.createIIRFilter).to.be.undefined;
        });

    });

});
