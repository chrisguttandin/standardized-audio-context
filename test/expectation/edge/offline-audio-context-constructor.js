import 'reflect-metadata';
import { ReflectiveInjector } from '@angular/core';
import { unpatchedOfflineAudioContextConstructor } from '../../../src/unpatched-offline-audio-context-constructor';
import { window as wndw } from '../../../src/window';

describe('offlineAudioContextConstructor', function () {

    var offlineAudioContext,
        OfflineAudioContext;

    beforeEach(function () {
        /* eslint-disable indent */
        var injector = ReflectiveInjector.resolveAndCreate([
                { provide: unpatchedOfflineAudioContextConstructor, useFactory: unpatchedOfflineAudioContextConstructor },
                { provide: wndw, useValue: window }
            ]);
        /* eslint-enable indent */

        OfflineAudioContext = injector.get(unpatchedOfflineAudioContextConstructor);

        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('length', function () {

        // bug #17

        it('should not expose its length', function () {
            expect(offlineAudioContext.length).to.be.undefined;
        });

    });

    describe('createBufferSource()', function () {

        // bug #11

        it('should not be chainable', function () {
            var audioBufferSourceNode = offlineAudioContext.createBufferSource(),
                gainNode = offlineAudioContext.createGain();

            expect(audioBufferSourceNode.connect(gainNode)).to.be.undefined;
        });

        // bug #14

        it('should not resample an oversampled AudioBuffer', function (done) {
            var audioBuffer = offlineAudioContext.createBuffer(1, 8, 88200),
                audioBufferSourceNode = offlineAudioContext.createBufferSource(),
                eightRandomValues = [];

            for (let i = 0; i < 8; i += 1) {
                eightRandomValues[i] = (Math.random() * 2) - 1;
            }

            audioBuffer.copyToChannel(new Float32Array(eightRandomValues), 0);

            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.start(0);
            audioBufferSourceNode.connect(offlineAudioContext.destination);

            offlineAudioContext
                .startRendering()
                .then((buffer) => {
                    var channelData = new Float32Array(4);

                    buffer.copyFromChannel(channelData, 0);

                    expect(channelData[0]).to.closeTo(eightRandomValues[0], 0.0000001);
                    expect(channelData[1]).to.closeTo(eightRandomValues[2], 0.0000001);
                    expect(channelData[2]).to.closeTo(eightRandomValues[4], 0.0000001);
                    expect(channelData[3]).to.closeTo(eightRandomValues[6], 0.0000001);

                    done();
                });
        });

    });

    describe('createChannelMerger()', function () {

        // bug #11

        it('should not be chainable', function () {
            var channelMergerNode = offlineAudioContext.createChannelMerger(),
                gainNode = offlineAudioContext.createGain();

            expect(channelMergerNode.connect(gainNode)).to.be.undefined;
        });

    });

    describe('createGain()', function () {

        // bug #11

        it('should not be chainable', function () {
            var gainNodeA = offlineAudioContext.createGain(),
                gainNodeB = offlineAudioContext.createGain();

            expect(gainNodeA.connect(gainNodeB)).to.be.undefined;
        });

    });

    describe('createIIRFilter()', function () {

        // bug #9

        it('should not be implemented', function () {
            expect(offlineAudioContext.createIIRFilter).to.be.undefined;
        });

    });

});
