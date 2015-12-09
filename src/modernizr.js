'use strict';

import { annotate } from 'di';
/* eslint-disable no-unused-vars */
import promises from 'browsernizr/test/es6/promises';
import typedArrays from 'browsernizr/test/typed-arrays';
import webaudio from 'browsernizr/test/audio/webaudio';
/* eslint-enable no-unused-vars */

// browsernizr needs to be imported after the individual tests
import modernizr from 'browsernizr';

export function Modernizr () {

    return modernizr;

}

annotate(Modernizr);
