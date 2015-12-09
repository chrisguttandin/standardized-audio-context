'use strict';

import { annotate, Inject } from 'di';
import { Modernizr } from './modernizr';

export function provider (modernizr) {

    return modernizr.promises && modernizr.typedarrays && modernizr.webaudio;

}

annotate(provider, new Inject(Modernizr));
