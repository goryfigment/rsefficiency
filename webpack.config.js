const webpack = require('webpack');
const path = require("path");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleTracker = require('webpack-bundle-tracker');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const glob = require('glob-all');
const PurifyCSSPlugin = require('purifycss-webpack');

module.exports = {
    entry: {
        home: './templates/js/home.js',
        404: './templates/js/home.js',
        500: './templates/js/home.js',
        donate: './templates/js/donate.js',
        treasure_trails: './templates/js/treasure_trails.js',
        grand_exchange: './templates/js/grand_exchange.js',
        calculator: './templates/js/calculator.js',
        quest: './templates/js/quest.js'
    },
    output: {path: __dirname + '/templates/bundle', filename: 'js/[name].js', publicPath: '/templates/bundle/'},
    module: {
        loaders: [
            {test: /\.css$/, loader: ExtractTextPlugin.extract({use: ['css-loader', 'postcss-loader'], publicPath: '../'})},
            {test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file-loader?name=assets/fonts/[name].[ext]'},
            {test: /\.(jpe?g|png|gif|svg)$/i, loader: ["file-loader?name=../../[path][name].[ext]", 'image-webpack-loader']},
            {test: /\.hbs$/, loader: 'handlebars-loader', options:{helperDirs: path.resolve(__dirname, "./templates/handlebars/helpers")}}
        ]
    },
    plugins: [
        new BundleTracker({filename: './webpack-stats.json'}),
        new ExtractTextPlugin('css/[name].css'),
        new webpack.optimize.CommonsChunkPlugin('vendors'),
        new UglifyJSPlugin({mangle: {except: ['$super', '$', 'exports', 'require']}, extractComments: true}),

        //Purify CSS
        new PurifyCSSPlugin({paths: glob.sync([path.join(__dirname, 'templates/*.html'), path.join(__dirname, 'templates/quests/*.html'), path.join(__dirname, 'templates/partials/*.html')]), minimize: true,
            purifyOptions: {whitelist: ['active', 'selected', 'index', 'positive', 'negative', 'neutral', 'question', 'multiple', 'ingredient', 'substitute-cost', 'subheaders', 'sortable', 'descending', 'ascending', '*-img*', 'exp-wrapper', 'highscore-wrapper', 'calculator-options',
                'next-level', 'next-level-title', 'next-level-container', 'highscore-submit', 'combat-submit', 'highscore-username', 'highscore-label', 'highscore-wrapper', 'exp-input', "output_wrapper", 'infinite', '*pure*', 'chat-dialog']}
        }),
        //new PurifyCSSPlugin({paths: glob.sync([path.join(__dirname, 'templates/404.html'), path.join(__dirname, 'templates/partials/*.html')]), minimize: true}),
        //new PurifyCSSPlugin({paths: glob.sync([path.join(__dirname, 'templates/500.html'), path.join(__dirname, 'templates/partials/*.html')]), minimize: true}),
        //new PurifyCSSPlugin({paths: glob.sync([path.join(__dirname, 'templates/donate.html'), path.join(__dirname, 'templates/partials/*.html')]), minimize: true}),
        //new PurifyCSSPlugin({paths: glob.sync([path.join(__dirname, 'templates/treasure_trails.html'), path.join(__dirname, 'templates/partials/*.html'), path.join(__dirname, 'templates/handlebars/treasure_trails/*.hbs')]), minimize: true}),

        //HTML
        new HtmlWebpackPlugin({filename: 'home.html', chunks: ['vendors','home'], minify: {collapseWhitespace: true}, hash: true, template: './templates/home.html'}),
        new HtmlWebpackPlugin({filename: '404.html', chunks: ['vendors','home'], minify: {collapseWhitespace: true}, hash: true, template: './templates/404.html'}),
        new HtmlWebpackPlugin({filename: '500.html', chunks: ['vendors','home'], minify: {collapseWhitespace: true}, hash: true, template: './templates/500.html'}),
        new HtmlWebpackPlugin({filename: 'donate.html', chunks: ['vendors','donate'], minify: {collapseWhitespace: true}, hash: true, template: './templates/donate.html'}),
        new HtmlWebpackPlugin({filename: 'treasure_trails.html', chunks: ['vendors','treasure_trails'], minify: {collapseWhitespace: true}, hash: true, template: './templates/treasure_trails.html'}),
        new HtmlWebpackPlugin({filename: 'grand_exchange.html', chunks: ['vendors','grand_exchange'], minify: {collapseWhitespace: true}, hash: true, template: './templates/grand_exchange.html'}),
        new HtmlWebpackPlugin({filename: 'calculator.html', chunks: ['vendors','calculator'], minify: {collapseWhitespace: true}, hash: true, template: './templates/calculator.html'}),
        new HtmlWebpackPlugin({filename: 'quest.html', chunks: ['vendors','quest'], minify: {collapseWhitespace: true}, hash: true, template: './templates/quest.html'}),

        //Quest Templates
        new HtmlWebpackPlugin({filename: 'quests/priest_in_peril.html', chunks: ['vendors','quest'], minify: {collapseWhitespace: true}, hash: true, template: "./templates/quests/priest_in_peril.html"}),
        new HtmlWebpackPlugin({filename: 'quests/witchs_house.html', chunks: ['vendors','quest'], minify: {collapseWhitespace: true}, hash: true, template: "./templates/quests/witchs_house.html"})
    ]
};