'use strict';

var path = require('path');

exports.port = 8080;
exports.rootDir = path.resolve(__dirname + '/..');
exports.clientDir = exports.rootDir + '/src';
exports.serverDir  = exports.rootDir + '/server';
