import 'reflect-metadata';
import { ReflectiveInjector } from '@angular/core';
import { unpatchedAudioContextConstructor } from '../../../src/unpatched-audio-context-constructor';
import { window as wndw } from '../../../src/window';

describe('audioContextConstructor', function () {

    var audioContext,
        AudioContext;

    // @todo Use beforeEach() again when the AudioContext can be closed.
    before(function () {
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

    describe('createAnalyser()', function () {

        // bug #11

        it('should not be chainable', function () {
            var analyserNode = audioContext.createAnalyser(),
                gainNode = audioContext.createGain();

            expect(analyserNode.connect(gainNode)).to.be.undefined;
        });

    });

    describe('createBiquadFilter()', function () {

        // bug #11

        it('should not be chainable', function () {
            var biquadFilterNode = audioContext.createBiquadFilter(),
                gainNode = audioContext.createGain();

            expect(biquadFilterNode.connect(gainNode)).to.be.undefined;
        });

        describe('getFrequencyResponse()', function () {

            // bug #22

            it('should fill the magResponse and phaseResponse arrays with the deprecated algorithm', function () {
                var biquadFilterNode = audioContext.createBiquadFilter(),
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

    describe('createChannelSplitter()', function () {

        // bug #11

        it('should not be chainable', function () {
            var channelSplitterNode = audioContext.createChannelSplitter(),
                gainNode = audioContext.createGain();

            expect(channelSplitterNode.connect(gainNode)).to.be.undefined;
        });

        // bug #29

        it('should have a channelCountMode of max', function () {
            var channelSplitterNode = audioContext.createChannelSplitter();

            expect(channelSplitterNode.channelCountMode).to.equal('max');
        });

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

        // bug #11

        it('should not be chainable', function () {
            var gainNodeA = audioContext.createGain(),
                gainNodeB = audioContext.createGain();

            expect(gainNodeA.connect(gainNodeB)).to.be.undefined;
        });

        describe('cancelAndHoldAtTime()', function () {

            var gainNode;

            beforeEach(function () {
                gainNode = audioContext.createGain();
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
            expect(audioContext.createIIRFilter).to.be.undefined;
        });

    });

    describe('createOscillator()', function () {

        // bug #11

        it('should not be chainable', function () {
            var gainNode = audioContext.createGain(),
                oscillatorNode = audioContext.createOscillator();

            expect(oscillatorNode.connect(gainNode)).to.be.undefined;
        });

    });

    describe('decodeAudioData()', function () {

        // bug #27

        it('should reject the promise with a DOMException', function (done) {
            audioContext
                .decodeAudioData(null)
                .catch(function (err) {
                    expect(err).to.be.an.instanceOf(DOMException);

                    done();
                });
        });

    });

});
