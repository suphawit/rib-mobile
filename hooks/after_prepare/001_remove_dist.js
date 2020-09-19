#!/usr/bin/env node

var path  = require('path');
const fs = require('fs-extra');

var rootdir = process.argv[2];

var distDirwww = path.join(rootdir, 'www');

fs.remove(distDirwww, function (err) {
    if (err) throw err;
    process.stdout.write('renamed dist complete' + '\n');
});
