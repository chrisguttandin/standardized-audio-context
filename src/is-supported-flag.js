'use strict';

import { Inject } from 'angular2/core';
import { modernizr } from './modernizr';

export function isSupportedFlag (modernizr) {

    return modernizr.promises && modernizr.typedarrays && modernizr.webaudio;

}

isSupportedFlag.parameters = [ [ new Inject(modernizr) ] ];
