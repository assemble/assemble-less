define(['underscore'], function () {
    var module = window._;

    if (module === void 0) {
        // https://github.com/documentcloud/underscore/blob/599d31101b7a7b896ff73e338d26ae698833f878/underscore.js
        throw "Missing Dependency: Underscore.js v1.3.3";
    }

    module = module.noConflict(); // Optional, but recommended :)

    return module;
});