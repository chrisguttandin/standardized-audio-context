module.exports = {
    modernizr: {
        files: {
            'src/browsernizr.ts': [
                'src/modernizr.js'
            ]
        },
        options: {
            patterns: [ {
                match: /;(\(function\(window,\sdocument,\sundefined\)\{)/g,
                replacement: `interface WindowWithPromise extends Window {
    Promise: any;
}
declare var window: WindowWithPromise;

export default (function(window: any, document: any, undefined?: any){`
            }, {
                match: /var\sModernizr\s=\sfunction\(\)\s\{};/g,
                replacement: 'var Modernizr:any = function() {};'
            }, {
                match: /window.Modernizr\s=\s(Modernizr;)/g,
                replacement: 'return $1'
            } ]
        }
    }
};
