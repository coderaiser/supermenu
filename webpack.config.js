'use strict';

const path = require('path');
const dir = './lib';

const {env} = process;

const dist = path.resolve(__dirname, 'dist');
const devtool = 'source-map';

const rules = [{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
}, {
    test: /\.css$/,
    loader: 'style-loader!css-loader!clean-css-loader',
}];

const filename = '[name].min.js';

module.exports = {
    devtool,
    entry: {
        supermenu: `${dir}/supermenu.js`,
    },
    output: {
        library: 'supermenu',
        filename,
        path: dist,
        pathinfo: true,
        libraryTarget: 'umd',
        devtoolModuleFilenameTemplate,
    },
    module: {
        rules,
    },
};

function devtoolModuleFilenameTemplate(info) {
    const resource = info.absoluteResourcePath.replace(__dirname + path.sep, '');
    return `file://supermenu/${resource}`;
}

