'use strict';

const {run} = require('madrun');

module.exports = {
    'lint': () => run('lint:*'),
    'fix:lint': () => run('lint:*', '--fix'),
    'lint:js': () => 'putout lib madrun.js webpack.config.js',
    'lint:css': () => 'stylelint css',
    'build': () => 'webpack --progress --mode production',
    'prepublishOnly': () => run('build'),
};

