module.exports = function(grunt) {
  var path = require('path');

  grunt.registerMultiTask('variables', 'Pass variables to the less parser before compiling.', function() {

    // Default options.
    var options = this.options({
      banner: '',
      variables: {}
    });
    // Process banner
    var banner = grunt.template.process(options.banner);

    grunt.verbose.writeflags(options, 'Variables options');

    var lessVar;
    var output = options.banner + '\n';
    for (lessVar in options.variables) {
      var value = options.variables[lessVar];
      output += '@' + lessVar + ': ' + value + ';\n';
    }
    output += '\n';

    var task = this;
    (function(output) {
      var srcFiles      = task.files;
      var destFiles     = [];
      var srcFilesLenth = srcFiles.length; 

      var i; 
      for (i = 0, srcFilesLenth; i < srcFilesLenth; i++) {

        var file = srcFiles[i];
        var src  = file.src;
        var srcLength = src.length;
        var dest = file.dest;

        var _j; 
        for (_j = 0, srcLength; _j < srcLength; _j++) {
          var srcPath = src[_j];
          var destFilePath = getRelativePath(path.resolve(dest), path.resolve(srcPath));
          output += '@import "' + destFilePath + '";\n';
        }
        grunt.file.write(dest, output);
        destFiles.push(grunt.log.writeln('File "' + dest.cyan + '" created.'));
      }
      return destFiles;

    })(output);
  });

  var urlNormalize = function(urlNormalize) {
    return urlNormalize.replace(/\\/g, '/');
  };

  var getRelativePath = function(from, to) {
    var fromDirname, relativePath, toBasename, toDirname;
    fromDirname = path.normalize(path.dirname(from));
    toDirname = path.normalize(path.dirname(to));
    toBasename = path.basename(to);
    relativePath = path.relative(fromDirname, toDirname);
    return urlNormalize(path.join(relativePath, toBasename));
  };

};