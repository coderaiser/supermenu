'use strict';

const {run} = require('madrun');

module.exports = {
    'fix:lint': () => run('lint', '--fix'),
    'lint': () => 'putout .',
    'build': () => 'webpack --progress --mode production',
    'wisdom': () => run('build'),
    'wisdom:done': () => run('upload:*'),
    'upload:main': () => upload('dist/supermenu.min.js'),
    'upload:main:map': () => upload('dist/supermenu.min.js.map'),
};

function upload(name) {
    return 'putasset -o coderaiser -r supermenu -t v`version`' + ` -f ${name}`;
}

