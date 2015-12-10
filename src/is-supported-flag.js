'use strict';

import { Inject } from 'angular2/angular2';
import { modernizr } from './modernizr';

export function isSupportedFlag (modernizr) {

    return modernizr.promises && modernizr.typedarrays && modernizr.webaudio;

}

isSupportedFlag.parameters = [ [ new Inject(modernizr) ] ];
