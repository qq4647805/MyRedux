var os = require('os');
var ifaces = os.networkInterfaces();
var ip;
Object.keys(ifaces).forEach(function(dev) {
    ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4' && details.address != '127.0.0.1') {
            ip = details.address
                // logger.info(('  ' + protocol + details.address + ':' + colors.green(port.toString())));
        }
    });
});
var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
//定义了一些文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
var webpack = require('webpack');
var ENV = process.env.NODE_ENV || 'development';
(process.env.N == 1) && (ENV = 'production')
module.exports = {
    entry: {
        // app:APP_PATH+'/index.jsx',
        app: APP_PATH + '/test.js',
    },
    output: {
        path: BUILD_PATH,
        // filename: 'lib/JSBridge.min.js',
        filename: 'test.js',
        // library: 'JSBridge',
        // libraryTarget: 'umd',
        // umdNamedDefine: true
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, ]
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        colors: true,
        host: '10.50.13.162',
    },
    plugins: ([
        new HtmlwebpackPlugin({
            title: 'test JSBridge',
            // filename:(ENV==='production')?BUILD_PATH+'/index.html':'index.html',
            template: APP_PATH + '/text.html',
            // minify: { collapseWhitespace: true }
        }),
    ]).concat(ENV === 'production' ? [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    ] : []),
    stats: { colors: true },
};