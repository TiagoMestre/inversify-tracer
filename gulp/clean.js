'use strict';

const del = require('del');

module.exports = function (gulp) {

	gulp.task('clean', () => {
		return del(['lib','reports','coverage']);
	});

	gulp.task('clean:all', () => {
		return del(['lib','node_modules','reports','coverage']);
	});

	gulp.task('clean:tests', () => {
		return del(['reports','coverage']);
	});
};