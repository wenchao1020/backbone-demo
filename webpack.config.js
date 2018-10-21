var webpack = require('webpack');
var path = require("path");
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin({name:'common',minChunks: 2});
//PostCSS plugins
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
		entry: { main: './js/main.js' },
		output: {
				path: path.join(__dirname, './js/'), //文件输出目录
				publicPath: './js/',
				filename: '[name].js'
		},
		plugins: [commonsPlugin,new ExtractTextPlugin("[name].css")
		],
		module: {
				loaders: [
						{
								test: /\.css$/,
								loader: ExtractTextPlugin.extract("style-loader", "css-loader", {
										publicPath: './'
								})
						},
						{
								test: /\.(jpg|png|woff|ttf|svg|gif)$/,
								loader: "url?limit=8000"
						},
						{
								test: /\.json$/,
								loader: 'json'
						}
				]
		},
		postcss: [
				autoprefixer({browsers: ['last 2 versions', "> 1%"]})
		],
		resolve: {
				root: [
						path.resolve(__dirname)
				],
				alias: {
						validate: 'lib/jquery.validate.js',
						formAjax: 'lib/jquery.form.js',
						customValidate: 'lib/additional-methods.js'
				},
				extensions: ['', '.js', '.css']
		}
};

