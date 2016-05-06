import { Inject } from '@angular/core/src/di/decorators';
import { modernizr } from './modernizr';

export function isSupportedPromise (modernizr) {
    return Promise
        .all([
            modernizr.promises,
            modernizr.typedarrays,
            modernizr.webaudio
        ])
        .then((results) => results.every((result) => result));
}

isSupportedPromise.parameters = [ [ new Inject(modernizr) ] ];
