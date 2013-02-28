
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function() {

  return {

    isEmpty: function(value) {

      if(value == null ||
         value == undefined ||
         toString.call(value) === 'undefined') {
        return true;
      }

      if(toString.call(value) === '[object Array]' && value.length === 0) {
        return true;
      }

      if(toString.call(value) === '[object Object]') {
        for(var i in value) {
          return false;
        }
        return true;
      }

      return false;
    }

  };

});
