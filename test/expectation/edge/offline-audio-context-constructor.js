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

    describe('createBiquadFilter()', function () {

        describe('getFrequencyResponse()', function () {

            // bug #22

            it('should fill the magResponse and phaseResponse arrays with the deprecated algorithm', function () {
                var biquadFilterNode = offlineAudioContext.createBiquadFilter(),
                    magResponse = new Float32Array(5),
                    phaseResponse = new Float32Array(5);

                biquadFilterNode.getFrequencyResponse(new Float32Array([ 200, 400, 800, 1600, 3200 ]), magResponse, phaseResponse);

                expect(Array.from(magResponse)).to.deep.equal([ 1.1107852458953857, 0.8106917142868042, 0.20565471053123474, 0.04845593497157097, 0.011615658178925514 ]);
                expect(Array.from(phaseResponse)).to.deep.equal([ -0.7254799008369446, -1.8217267990112305, -2.6273605823516846, -2.906902313232422, -3.0283825397491455 ]);
            });

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

    describe('createChannelSplitter()', function () {

        // bug #29

        it('should have a channelCountMode of max', function () {
            var channelSplitterNode = offlineAudioContext.createChannelSplitter();

            expect(channelSplitterNode.channelCountMode).to.equal('max');
        });

        // bug #30

        it('should allow to reassign the channelCountMode', function () {
            var channelSplitterNode = offlineAudioContext.createChannelSplitter();

            channelSplitterNode.channelCountMode = 'explicit';
        });

        // bug #31

        it('should have a channelInterpretation of max', function () {
            var channelSplitterNode = offlineAudioContext.createChannelSplitter();

            expect(channelSplitterNode.channelInterpretation).to.equal('speakers');
        });

        // bug #32

        it('should allow to reassign the channelInterpretation', function () {
            var channelSplitterNode = offlineAudioContext.createChannelSplitter();

            channelSplitterNode.channelInterpretation = 'discrete';
        });

    });

    describe('createGain()', function () {

        // bug #11

        it('should not be chainable', function () {
            var gainNodeA = offlineAudioContext.createGain(),
                gainNodeB = offlineAudioContext.createGain();

            expect(gainNodeA.connect(gainNodeB)).to.be.undefined;
        });

        describe('cancelAndHoldAtTime()', function () {

            var gainNode;

            beforeEach(function () {
                gainNode = offlineAudioContext.createGain();
            });

            // bug #28

            it('should not be implemented', function () {
                expect(gainNode.cancelAndHoldAtTime).to.be.undefined;
            });

        });

    });

    describe('createIIRFilter()', function () {

        // bug #9

        it('should not be implemented', function () {
            expect(offlineAudioContext.createIIRFilter).to.be.undefined;
        });

    });

    describe('decodeAudioData()', function () {

        // bug #27

        it('should reject the promise with a DOMException', function (done) {
            offlineAudioContext
                .decodeAudioData(null)
                .catch(function (err) {
                    expect(err).to.be.an.instanceOf(DOMException);

                    done();
                });
        });

    });

});
