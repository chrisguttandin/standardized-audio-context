'use strict';

import { annotate } from 'di';
import 'browsernizr/test/audio/webaudio';
import 'browsernizr/test/es6/promises';
import 'browsernizr/test/typed-arrays';

// browsernizr needs to be imported after the individual tests
import modernizr from 'browsernizr';

export function Modernizr () {

    return modernizr;

}

annotate(Modernizr);
