'use strict';

var di = require('di');

function Window () {

    return window;

}

di.annotate(Window);

module.exports.Window = Window;
