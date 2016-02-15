'use strict';

module.exports = {
    modernizr: {
        files: {
            'build/browsernizr.js': [
                'build/modernizr.js'
            ]
        },
        options: {
            patterns: [ {
                match: /;(\(function\(window,\sdocument,\sundefined\)\{)/g,
                replacement: 'module.exports = $1'
            }, {
                match: /window.Modernizr\s=\s(Modernizr;)/g,
                replacement: 'return $1'
            } ]
        }
    }
};
