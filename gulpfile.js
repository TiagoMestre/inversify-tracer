'use strict';

const gulp = require('gulp');
const requireDirectory = require('require-directory');

const tasks = requireDirectory(module, './gulp');

for(let taskName in tasks) {
	tasks[taskName](gulp);
}
