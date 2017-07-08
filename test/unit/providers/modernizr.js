import 'core-js/es7/reflect';
import { MODERNIZR_PROVIDER, modernizr as mdrnzr } from '../../../src/providers/modernizr';
import { ReflectiveInjector } from '@angular/core';

describe('modernizr', () => {

    let modernizr;

    beforeEach(() => {
        const injector = ReflectiveInjector.resolveAndCreate([
            MODERNIZR_PROVIDER
        ]);

        modernizr = injector.get(mdrnzr);
    });

    it('should contain the result of the promises test', () => {
        expect(modernizr.promises).to.be.a('boolean');
    });

    it('should contain the result of the typedarrays test', () => {
        expect(modernizr.typedarrays).to.be.a('boolean');
    });

    it('should contain the result of the webaudio test', () => {
        expect(modernizr.webaudio).to.be.a('boolean');
    });

});
