'use strict';

import { annotate } from 'di';

export function Window () {

    /* eslint-disable no-undef */
    return window;
    /* eslint-enable no-undef */

}

annotate(Window);
