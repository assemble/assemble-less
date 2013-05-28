module.exports = function(grunt) {


  grunt.registerMultiTask('variables', 'Pass variables to the less parser before compiling.', function() {

    // Default options.
    var options = this.options({
      root: 'src', 
    });

    var name; 
    var task  = this;
    var output = '// Source generated by assemble-less\n';

    var ref = this.options();
    for (name in ref) {
      var value = ref[name];
      output += '@' + name + ': ' + value + ';\n';
    }
    output += '\n';
    (function(output) {
      var i, _j, len, len1;
      var ref1 = task.files;
      var destFiles = [];

      for (i = 0, len = ref1.length; i < len; i++) {
        var base = '';
        var file = ref1[i];
        var dirs = file.dest.split('/');
        var src  = file.src;

        dirs.splice(0, dirs.length - 1).forEach(function(dir) {
          base += options.root;
        });

        for (_j = 0, len1 = src.length; _j < len1; _j++) {
          var path = src[_j];
          output += '@import "' + options.root + '/' + path + '";\n';
        }
        grunt.file.write(file.dest, output);
        destFiles.push(grunt.log.writeln('File "' + file.dest + '" created.'));
      }
      destFiles;
    })(output);
  });

};