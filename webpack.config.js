"use strict";

var webpack = require('webpack');

let commonsPlugin = new webpack.optimize.CommonsChunkPlugin({
		name: 'commons',  // Just name it
		filename: 'common.js' // Name of the output file
		// There are more options, but we don't need them yet.
	}
);

module.exports = {
	entry: {
		simpleTest: "./public/other/simpleTest-src.ts",
		test_ts: "./public/ts/test-src.ts",
		test_js: "./public/js/test-src.js",
		cloud_connect_js: "./public/cloud_connect/test-src.js",
		npd_welcome_js: "./public/npd_welcome/test-src.js",
		npd_sale_js: "./public/npd_sale/test-src.js",
		npd_read_card_data_js: "./public/npd_read_card_data/test-src.js",
		cloud_read_card_data_js: "./public/cloud_read_card_data/test-src.js"
	},
	resolve: {
		extensions: ['.js', '.ts']
	},
	output: {
		path: "./public/built",
		filename: "[name]-bundle.js"
	},
	plugins: [ commonsPlugin ],
	module: {
		loaders: [
			// all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
			{test: /\.tsx?$/, loader: "ts-loader"}
		]
	}
};
