const path = require("path");

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src'),
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js','.jsx', '.css', '.png']
    },
    devServer: {
        historyApiFallback: true
    },
    module: {
        rules: [{
            test: /\.jsx?/,
            loader:"babel-loader",
            exclude: /node_modules/
        }]
    }
};