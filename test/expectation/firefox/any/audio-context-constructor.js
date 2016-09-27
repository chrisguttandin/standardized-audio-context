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

        // bug #25

        it('should not allow to use setValueCurveAtTime after calling cancelScheduledValues', function () {
            var gainNode = audioContext.createGain();

            gainNode.gain.setValueCurveAtTime(new Float32Array([ 1, 1 ]), 0, 1);
            gainNode.gain.cancelScheduledValues(0.2);
            expect(function () {
                gainNode.gain.setValueCurveAtTime(new Float32Array([ 1, 1 ]), 0.4, 1);
            }).to.throw(Error);
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
