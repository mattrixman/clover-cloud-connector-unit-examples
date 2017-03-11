var path = require('path');

module.exports = {
	entry: './public/test-src.js',
	resolve: {
		extensions: ['.js']
	},
	output: {
		filename: 'test.js',
		path: path.resolve(__dirname, 'public/built')
	}
};
