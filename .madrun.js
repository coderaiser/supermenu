'use strict';

const {run} = require('madrun');
const {version} = require('./package');

module.exports = {
    'lint': () => run('lint:*'),
    'fix:lint': () => run('lint:*', '--fix'),
    'lint:js': () => 'putout lib .madrun.js *.js',
    'lint:css': () => 'stylelint css',
    'build': () => 'webpack --progress --mode production',
    'wisdom': () => run('build'),
    'wisdom:done': () => run('upload:*'),
    'upload:main': () => upload('dist/supermenu.min.js'),
    'upload:main:map': () => upload('dist/supermenu.min.js.map'),
};

function upload(name) {
    return `putasset -o coderaiser -r supermenu -t v${version} -f ${name}`;
}

