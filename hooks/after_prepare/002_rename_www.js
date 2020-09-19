#!/usr/bin/env node

var path  = require('path');
var fs = require('fs');

var rootdir = process.argv[2];

var wwwDir = path.join(rootdir, 'www_temp');
var wwwDirTemp = path.join(rootdir, 'www');

fs.rename(wwwDir, wwwDirTemp, function (err) {
    if (err) throw err;
    process.stdout.write('renamed www complete' + '\n');

    process.stdout.write('clean process complete' + '\n');
});
