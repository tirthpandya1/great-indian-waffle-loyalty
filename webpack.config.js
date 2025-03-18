const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        // Add runtime transform to handle async/await
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: { importLoaders: 1 }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                config: path.resolve(__dirname, 'postcss.config.js'),
                            },
                        }
                    }
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        // Add fallbacks for node modules used by Firebase
        fallback: {
            "fs": false,
            "tls": false,
            "net": false,
            "path": false,
            "zlib": false,
            "http": false,
            "https": false,
            "stream": false,
            "crypto": false,
            "buffer": false,
            "util": false,
            "url": false,
            "querystring": false
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            favicon: './public/favicon.ico',
            // Add cache busting
            hash: true,
            // Improve error display
            showErrors: true,
            // Ensure this is the only HTML file being generated
            filename: 'index.html'
        }),
        new CopyPlugin({
            patterns: [
                { 
                    from: 'public', 
                    to: '', 
                    globOptions: {
                        ignore: ['**/index.html'] // Ignore copying index.html to avoid conflicts
                    }
                },
            ],
        }),
    ],
    devServer: {
        historyApiFallback: true,
        hot: true,
        static: {
            directory: path.join(__dirname, 'public'),
        },
        port: 3000,
        // Add better error overlay
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
        // Add detailed logging
        devMiddleware: {
            stats: 'errors-warnings',
        }
    },
    devtool: 'eval-source-map', // Better source maps for development
    // Add performance hints
    performance: {
        hints: 'warning',
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};
