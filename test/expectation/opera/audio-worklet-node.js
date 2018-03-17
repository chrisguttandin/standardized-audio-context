import 'core-js/es7/reflect';
import { WINDOW_PROVIDER, window as wndw } from '../../../src/providers/window';
import { ReflectiveInjector } from '@angular/core';

describe('AudioWorkletNode', () => {

    let window;

    beforeEach(() => {
        const injector = ReflectiveInjector.resolveAndCreate([
            WINDOW_PROVIDER
        ]);

        window = injector.get(wndw);
    });

    // bug #61

    it('should not be implemented', () => {
        expect(window.AudioWorkletNode).to.be.undefined;
    });

});
