import { Inject } from '@angular/core/src/di/decorators';
import { modernizr } from './modernizr';

export function isSupportedFlag (modernizr) {
    return modernizr.promises && modernizr.typedarrays && modernizr.webaudio;
}

isSupportedFlag.parameters = [ [ new Inject(modernizr) ] ];
