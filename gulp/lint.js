'use strict';

const tslint = require('gulp-tslint');

module.exports = function (gulp) {

	gulp.task('lint', () => {
	    return gulp
			.src(['src/**/*.ts', 'tests/**/*.ts'])
		    .pipe(tslint({
		    	formatter: 'verbose'
		    }))
			.pipe(tslint.report())
	});
};