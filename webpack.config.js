var path = require('path');

module.exports = {
	entry: './public/test-src.js',
	resolve: {
		extensions: ['.js', '.ts']
	},
	output: {
		filename: 'test.js',
		path: path.resolve(__dirname, 'public/built')
	},
	module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            {test: /\.tsx?$/, loader: "ts-loader"}
        ]
    }
};
