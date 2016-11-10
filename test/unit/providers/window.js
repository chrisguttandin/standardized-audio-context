import 'core-js/es7/reflect';
import { WINDOW_PROVIDER, Window } from '../../../src/providers/window';
import { ReflectiveInjector } from '@angular/core';

describe('window', () => {

    it('should return the global window', () => {
        const injector = ReflectiveInjector.resolveAndCreate([
            WINDOW_PROVIDER
        ]);

        expect(injector.get(Window)).to.equal(window);
    });

});
