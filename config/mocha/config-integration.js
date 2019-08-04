const { expect, use } = require('chai');
const babelOptions = require('../babel/test.json');
const babelRegister = require('@babel/register');
const { readFileSync } = require('fs');
const sinonChai = require('sinon-chai');

babelRegister(babelOptions);

use(sinonChai);

const compiler = require.extensions['.ts'];

require.extensions['.ts'] = function (mdl, filename) {
    if (!filename.includes('node_modules') && filename.includes('src/')) {
        const buildFilename = filename
            .replace('src/', 'build/node/')
            .slice(0, -3) + '.js';

        mdl._compile(readFileSync(buildFilename, 'utf8'), buildFilename);
    }

    if (compiler) {
        return compiler(mdl, filename);
    }
};

global.expect = expect;
