import 'reflect-metadata';
import { ReflectiveInjector } from '@angular/core';
import { spy } from 'sinon';
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

    describe('createChannelSplitter()', function () {

        // bug #30

        it('should allow to set the channelCountMode', function () {
            var channelSplitterNode = audioContext.createChannelSplitter();

            channelSplitterNode.channelCountMode = 'explicit';
        });

        // bug #31

        it('should have a channelInterpretation of max', function () {
            var channelSplitterNode = audioContext.createChannelSplitter();

            expect(channelSplitterNode.channelInterpretation).to.equal('speakers');
        });

        // bug #32

        it('should allow to set the channelInterpretation', function () {
            var channelSplitterNode = audioContext.createChannelSplitter();

            channelSplitterNode.channelInterpretation = 'discrete';
        });

    });

    describe('createGain()', function () {

        var gainNode;

        beforeEach(function () {
            gainNode = audioContext.createGain();
        });

        describe('cancelAndHoldAtTime()', function () {

            // bug #28

            it('should not be implemented', function () {
                expect(gainNode.cancelAndHoldAtTime).to.be.undefined;
            });

        });

    });

    describe('decodeAudioData()', function () {

        // bug #6

        it('should not call the errorCallback at all', function (done) {
            var errorCallback = spy();

            audioContext.decodeAudioData(null, function () {}, errorCallback);

            setTimeout(function () {
                expect(errorCallback).to.have.not.been.called;

                done();
            }, 1000);
        });

    });

});
