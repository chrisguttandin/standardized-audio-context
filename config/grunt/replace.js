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

export default (function(window: any){`
            }, {
                match: /var\stests\s=\s\[\];/g,
                replacement: 'var tests: any[] = [];'
            }, {
                match: /_q:\s\[\],/g,
                replacement: '_q: <any[]> [],'
            }, {
                match: /on:\sfunction\(test,\scb\)\s{/g,
                replacement: 'on: function(this: any, test: any, cb: any) {'
            }, {
                match: /addTest:\sfunction\(name,\sfn,\soptions\)\s{/g,
                replacement: 'addTest: function(name: any, fn: any, options: any) {'
            }, {
                match: /addAsyncTest:\sfunction\(fn\)\s{/g,
                replacement: 'addAsyncTest: function(fn: any) {'
            }, {
                match: /var\sModernizr\s=\sfunction\(\)\s\{};/g,
                replacement: 'var Modernizr:any = function() {};'
            }, {
                match: /var\sclasses\s=\s\[\];/g,
                replacement: 'var classes: any[] = [];'
            }, {
                match: /function\sis\(obj,\stype\)\s\{/g,
                replacement: 'function is(obj: any, type: any) {'
            }, {
                match: /window.Modernizr\s=\s(Modernizr;)/g,
                replacement: 'return $1'
            }, {
                match: /\}\)\(window,\sdocument\);/g,
                replacement: '})(window);\n'
            }, {
                match: /new\swindow.Promise\(function\(r\)\s\{\sresolve\s=\sr;\s\}\);/g,
                replacement: 'new window.Promise(function(r: any) { resolve = r; });'
            } ]
        }
    }
};
