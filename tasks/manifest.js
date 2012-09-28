/*
 * grunt-contrib-manifest
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Tim Branyen, contributors
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt-contrib-jst/blob/master/LICENSE-MIT
 */

module.exports = function (grunt) {
  "use strict";

  grunt.registerMultiTask("manifest", "Generate HTML5 cache manifest", function () {

    var helpers = require("grunt-contrib-lib").init(grunt);
    var options = helpers.options(this, {timestamp:true});

    // If we have a basePath, specify it
    if (this.data.options.basePath) {
      //var base = grunt.file.expandDirs(this.data.options.basePath);
      var base = this.data.options.basePath;
      grunt.file.setBase(base);
    }

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);

    var verbose = true;
    var done = this.async();
    var files = grunt.file.expandFiles(this.file.src);
    var destFile = this.file.dest;
    var contents = "CACHE MANIFEST\n";
    var excludeFiles = options.exclude;

    grunt.verbose.writeflags(options, "Options");

    // "src" is required
    if (!this.file.src) {
      grunt.fatal("Need to specify source directory for the files.", 2);
    }

    // Set default destination file
    if (!destFile) {
      destFile = "manifest.appcache";
    }

    if (verbose) {
      contents += "# This manifest was generated by grunt-contrib-manifest HTML5 Cache Manifest Generator\n";
    }
    if (options.timestamp) {
      contents += "# Time: " + new Date() + "\n";
    }

    // Cache section
    contents += "\nCACHE:\n";

    // Exclude files
    if (excludeFiles) {
      files = files.filter(function (item) {
        return excludeFiles.indexOf(item) === -1;
      });
    }

    // Add files to explicit cache
    files.forEach(function (item) {
      contents += item + "\n";
    });

    // Network section
    if (options.network) {
      contents += "\nNETWORK:\n";
      options.network.forEach(function (item) {
        contents += item + "\n";
      });
    } else {
      // If there's no network section, add a default "*" wildcard
      contents += "\nNETWORK:\n";
      contents += "*\n";
    }

    // Fallback section
    if (options.fallback) {
      contents += "\nFALLBACK:\n";
      options.fallback.forEach(function (item) {
        contents += item + "\n";
      });
    }

    // Settings section
    if (options.preferOnline) {
      contents += "\nSETTINGS:\n";
      contents += "prefer-online\n";
    }

    // Write file to disk
    grunt.verbose.writeln("\n" + (contents).yellow);
    grunt.file.write(destFile, contents);
    done();
  });

};
