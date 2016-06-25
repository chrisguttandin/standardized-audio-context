import 'reflect-metadata';
import { ReflectiveInjector } from '@angular/core';
import { loadFixture } from '../../../helper/load-fixture';
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

    describe('createChannelMerger()', function () {

        // bug #16

        it('should allow to set the channelCount', function () {
            var channelMergerNode = audioContext.createChannelMerger();

            channelMergerNode.channelCountMode = '2';
        });

        it('should allow to set the channelCountMode', function () {
            var channelMergerNode = audioContext.createChannelMerger();

            channelMergerNode.channelCountMode = 'max';
        });

    });

    describe('createGain()', function () {

        // bug #12

        it('should not allow to disconnect a specific destination', function (done) {
            var analyzer,
                candidate,
                channelData,
                dummy,
                ones,
                source;

            analyzer = audioContext.createScriptProcessor(256, 1, 1);
            candidate = audioContext.createGain();
            dummy = audioContext.createGain();

            ones = audioContext.createBuffer(1, 1, 44100);
            channelData = ones.getChannelData(0);
            channelData[0] = 1;

            source = audioContext.createBufferSource();
            source.buffer = ones;
            source.loop = true;

            source.connect(candidate);
            candidate.connect(analyzer);
            analyzer.connect(audioContext.destination);
            candidate.connect(dummy);
            candidate.disconnect(dummy);

            analyzer.onaudioprocess = function (event) {
                var channelData = event.inputBuffer.getChannelData(0);

                if (Array.prototype.some.call(channelData, (sample) => sample === 1)) {
                    done('should never happen');
                }
            };

            source.start();

            setTimeout(function () {
                source.stop();

                analyzer.onaudioprocess = null;

                source.disconnect(candidate);
                candidate.disconnect(analyzer);
                analyzer.disconnect(audioContext.destination);

                done();
            }, 500);
        });

    });

    describe('createIIRFilter()', function () {

        // bug #9

        it('should not be implemented', function () {
            expect(audioContext.createIIRFilter).to.be.undefined;
        });

    });

    describe('decodeAudioData()', function () {

        // bug #3

        it('should reject the promise with a TypeError', function (done) {
            audioContext
                .decodeAudioData(null)
                .catch(function (err) {
                    expect(err).to.be.an.instanceOf(TypeError);

                    expect(err.message).to.equal('Argument 1 of AudioContext.decodeAudioData is not an object.');

                    done();
                });
        });

        // bug #6

        it('should not call the errorCallback at all', function (done) {
            var errorCallback = spy();

            audioContext.decodeAudioData(null, function () {}, errorCallback);

            setTimeout(function () {
                expect(errorCallback).to.have.not.been.called;

                done();
            }, 1000);
        });

        // bug #7

        it('should call the errorCallback with undefined', function (done) {
            loadFixture('one-pixel-of-transparency.png', function (err, arrayBuffer) {
                expect(err).to.be.null;

                audioContext.decodeAudioData(arrayBuffer, function () {}, function (err) {
                    expect(err).to.be.undefined;

                    done();
                });
            });
        });

    });

});
