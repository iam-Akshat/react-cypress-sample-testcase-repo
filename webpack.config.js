const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
let killCommand = () => { }
module.exports = {
    entry: './src/index.js',

    output: {
        path: path.join(__dirname, "/dist"),
        filename: "index_bundle.js",
    },
    devServer: {
        onListening: function (server) {
            const port = server.listeningApp.address().port;
            killCommand = () => {
                server.close();
            }
            setTimeout(() => {
                server.close();
            }, 60000);
            console.log('Listening on port:', port);
        },

    },

    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.js$|\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                ]
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
    }
};
