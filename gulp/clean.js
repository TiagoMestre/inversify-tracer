'use strict';

const del = require('del');

module.exports = function (gulp) {

	gulp.task('clean', () => {
		return del(['build','reports','coverage']);
	});

	gulp.task('clean:all', () => {
		return del(['build','node_modules','reports','coverage']);
	});

	gulp.task('clean:tests', () => {
		return del(['reports','coverage']);
	});
};