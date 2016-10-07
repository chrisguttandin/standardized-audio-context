import 'reflect-metadata';
import { ReflectiveInjector } from '@angular/core';
import { loadFixture } from '../../../helper/load-fixture';
import { spy } from 'sinon';
import { unpatchedOfflineAudioContextConstructor } from '../../../../src/unpatched-offline-audio-context-constructor';
import { window as wndw } from '../../../../src/window';

describe('offlineAudioContextConstructor', function () {

    var offlineAudioContext,
        OfflineAudioContext;

    beforeEach(function () {
        /* eslint-disable indent */
        var injector = ReflectiveInjector.resolveAndCreate([
                { provide: unpatchedOfflineAudioContextConstructor, useFactory: unpatchedOfflineAudioContextConstructor },
                { provide: wndw, useValue: window }
            ]);
        /* eslint-enable indent */

        OfflineAudioContext = injector.get(unpatchedOfflineAudioContextConstructor);

        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('createChannelMerger()', function () {

        // bug #16

        it('should allow to set the channelCount', function () {
            var channelMergerNode = offlineAudioContext.createChannelMerger();

            channelMergerNode.channelCountMode = '2';
        });

        it('should allow to set the channelCountMode', function () {
            var channelMergerNode = offlineAudioContext.createChannelMerger();

            channelMergerNode.channelCountMode = 'max';
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

        // bug #25

        it('should not allow to use setValueCurveAtTime after calling cancelScheduledValues', function () {
            var gainNode = offlineAudioContext.createGain();

            gainNode.gain.setValueCurveAtTime(new Float32Array([ 1, 1 ]), 0, 1);
            gainNode.gain.cancelScheduledValues(0.2);
            expect(function () {
                gainNode.gain.setValueCurveAtTime(new Float32Array([ 1, 1 ]), 0.4, 1);
            }).to.throw(Error);
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

    describe('createScriptProcessor()', function () {

        // bug #13

        it('should not have any output', function () {
            var channelData,
                scriptProcessorNode = offlineAudioContext.createScriptProcessor(256, 1, 1);

            channelData = new Float32Array(scriptProcessorNode.bufferSize);

            scriptProcessorNode.connect(offlineAudioContext.destination);
            scriptProcessorNode.onaudioprocess = function (event) {
                channelData.fill(1);

                event.outputBuffer.copyToChannel(channelData, 0);
            };

            return offlineAudioContext
                .startRendering()
                .then((buffer) => {
                    var channelData = new Float32Array(scriptProcessorNode.bufferSize * 100);

                    buffer.copyFromChannel(channelData, 0, 256);

                    expect(Array.from(channelData)).to.not.contain(1);
                });
        });

    });

    describe('decodeAudioData()', function () {

        // bug #6

        it('should not call the errorCallback at all', function (done) {
            var errorCallback = spy();

            offlineAudioContext.decodeAudioData(null, function () {}, errorCallback);

            setTimeout(function () {
                expect(errorCallback).to.have.not.been.called;

                done();
            }, 1000);
        });

        // bug #7

        it('should call the errorCallback with undefined', function (done) {
            loadFixture('one-pixel-of-transparency.png', function (err, arrayBuffer) {
                expect(err).to.be.null;

                offlineAudioContext.decodeAudioData(arrayBuffer, function () {}, function (err) {
                    expect(err).to.be.undefined;

                    done();
                });
            });
        });

    });

});
