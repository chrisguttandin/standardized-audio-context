import 'core-js/es7/reflect';
import { UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER, unpatchedOfflineAudioContextConstructor } from '../../../../src/providers/unpatched-offline-audio-context-constructor';
import { ReflectiveInjector } from '@angular/core';
import { WINDOW_PROVIDER } from '../../../../src/providers/window';
import { loadFixture } from '../../../helper/load-fixture';

describe('offlineAudioContextConstructor', () => {

    let offlineAudioContext;
    let OfflineAudioContext;

    beforeEach(() => {
        const injector = ReflectiveInjector.resolveAndCreate([
            UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
            WINDOW_PROVIDER
        ]);

        OfflineAudioContext = injector.get(unpatchedOfflineAudioContextConstructor);

        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('createGain()', () => {

        // bug #12

        it('should not allow to disconnect a specific destination', (done) => {
            const candidate = offlineAudioContext.createGain();
            const dummy = offlineAudioContext.createGain();
            const ones = offlineAudioContext.createBuffer(1, 1, 44100);

            ones.getChannelData(0)[0] = 1;

            const source = offlineAudioContext.createBufferSource();

            source.buffer = ones;

            source.connect(candidate);
            candidate.connect(offlineAudioContext.destination);
            candidate.connect(dummy);
            candidate.disconnect(dummy);

            source.start();

            offlineAudioContext.oncomplete = (event) => {
                const channelData = event.renderedBuffer.getChannelData(0);

                expect(channelData[0]).to.equal(0);

                source.disconnect(candidate);
                candidate.disconnect(offlineAudioContext.destination);

                done();
            };
            offlineAudioContext.startRendering();
        });

    });

    describe('decodeAudioData()', () => {

        // bug #7

        it('should call the errorCallback with undefined', (done) => {
            loadFixture('one-pixel-of-transparency.png', (err, arrayBuffer) => {
                expect(err).to.be.null;

                offlineAudioContext.decodeAudioData(arrayBuffer, () => {}, (err) => {
                    expect(err).to.be.undefined;

                    done();
                });
            });
        });

    });

});
