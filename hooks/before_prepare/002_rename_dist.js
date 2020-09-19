#!/usr/bin/env node

var path  = require('path');
var fs = require('fs');

var rootdir = process.argv[2];

var distDir = path.join(rootdir, 'dist');
var distDirwww = path.join(rootdir, 'www');

fs.rename(distDir, distDirwww, function (err) {
    if (err) throw err;
    process.stdout.write('renamed dist complete' + '\n');
});
