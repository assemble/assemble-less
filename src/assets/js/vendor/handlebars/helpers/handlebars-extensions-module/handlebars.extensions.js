define(['underscore.module', 'handlebars'], function (_) {
    var module = window.Handlebars;

    if (module === void 0) {
        // https://github.com/downloads/wycats/handlebars.js/handlebars-1.0.0.beta.6.js
        throw "Missing Dependency: Handlebars v1.0 RC 1";
    }

    if (_ === void 0) {
        // https://github.com/documentcloud/underscore/blob/599d31101b7a7b896ff73e338d26ae698833f878/underscore.js
        throw "Missing Dependency: Underscore.js v1.3.3";
    }

    // TODO: Add this to Handlebars.Utils(?)...
    function isBlockHelper(options) {
        var keys = _.keys(options);
        return (_.include(keys, "inverse") && _.include(keys, "fn"));
    }

    function genericDualHelper(options, func) {
        var output, hash = options.hash, hashKeys = _.keys(hash);

        var ifFalse = isBlockHelper(options) ? options.inverse(this) : (_.include(hashKeys, "ifFalse") ? hash.ifFalse : "");
        var ifTrue = isBlockHelper(options) ? options.fn(this) : (_.include(hashKeys, "ifTrue") ? hash.ifTrue : "");

        output = func.call(this) ? ifTrue : ifFalse;

        return output;
    }

    /**
     * __toString__
     *
     * Inline helper to convert and ensure that a string is always returned.
     *
     * Examples
     *
     *     <span>{{toString context}}</span>
     *     <span>{{toString context replaceWith="I am a banana!"}}</span>
     *
     * @param {Number|String|Array|Object} context Value to check.
     * @param {Object} options options.hash properties supported:
     * @param {String} [replaceWith] String to use as replacement. If not defined, defaults to an empty string ("").
     * @returns {String} If context is null, undefined, an empty/blank string or an empty object/array, and if the optional replaceWith parameter is set (and it is a string), then returns replaceWith. Otherwise defaults to outputting an empty string.
     */
    module.registerHelper("toString", function (context, options) {
        var replaceWith = options.hash.replaceWith;
        var output = (!Handlebars.Utils.isEmpty(replaceWith) && _.isString(replaceWith)) ? replaceWith : "";
        if ((!Handlebars.Utils.isEmpty(context) && !_.isEmpty(context)) || _.isNumber(context)) {
            if (_.isString(context)) {
                if (!(/^\s+$/).test(context)) {
                    output = context;
                }
            } else if (_.isNumber(context)) {
                output = context.toString();
            }
        }

        return output;
    });

    /**
     * __eq__
     *
     * General purpose equality helper. Provides both block and inline helper functionality.
     *
     * If *context* equals *compareObject*, in Inline mode returns *ifTrue*, otherwise returns
     * *ifFalse*; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).
     *
     * Examples
     *
     *     <!-- Inline mode -->
     *     <span>{{eq context "compareObject"}}</span><!-- Outputs true or false -->
     *     <span>{{eq context "compareObject" ifTrue="Yay!" ifFalse="Boo!}}</span>
     *
     *     <!-- Block mode -->
     *     <select>
     *     {{#eq context "compareObject"}}
     *     <option>Yay!</option>
     *     {{/eq}}
     *     </select>
     *
     *     <select>
     *     {{#eq context "compareObject"}}
     *     <option>Yay!</option>
     *     {{else}}
     *     <option>Boo!</option>
     *     {{/eq}}
     *     </select>
     *
     * @param {Number|String|Array|Object} context Value to compare.
     * @param {Object} compareObject Value to compare context to.
     * @param {Object} options options.hash properties supported:
     * @param {String} [ifTrue] Value to return if *context* and *compareObject* are equal. If not defined, defaults to an empty string ("").
     * @param {String} [ifFalse] Value to return if *context* and *compareObject* are not equal. If not defined, defaults to an empty string ("").
     * @returns {String|Function}
     */
    module.registerHelper("eq", function (context, compareObject, options) {
        return genericDualHelper.call(this,options, function () {
            return (context == compareObject); // TODO: Add object, array, date comparisons...
        });
    });

    /**
     * __notEq__
     *
     * Inverse version of eq helper.
     */
    module.registerHelper('notEq', function (context, options) {
        var fn = options.fn, inverse = options.inverse;
        options.fn = inverse;
        options.inverse = fn;

        return Handlebars.helpers['eq'].call(this, context, options);
    });

    /**
     * __has__
     *
     * A "has" helper for Objects and Arrays, checks if *context* has a property or value that matches the *propertyName*.
     * Provides both block and inline helper functionality.
     *
     * If the *context* is an Object and it contains a property named *propertyName*, in Inline mode returns *ifTrue*, otherwise returns
     * *ifFalse*; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).
     *
     * If the *context* is an Array and it has a value equal to *propertyName*, in Inline mode returns *ifTrue*, otherwise returns
     * *ifFalse*; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).
     *
     *     <!-- Inline mode -->
     *     <span>{{has context "propertyName" ifTrue="Yay!"}}</span>
     *     <span>{{has context "propertyName" ifTrue="Yay!" ifFalse="Boo!}}</span>
     *
     *     <!-- Block mode -->
     *     <select>
     *     {{#has context "propertyName"}}
     *     <option>Yay!</option>
     *     {{/has}}
     *     </select>
     *
     *     <select>
     *     {{#has context "propertyName"}}
     *     <option>Yay!</option>
     *     {{else}}
     *     <option>Boo!</option>
     *     {{/has}}
     *     </select>
     *
     * @param {Array|Object} context Value to compare.
     * @param {Object} propertyName Value to compare context to.
     * @param {Object} options options.hash properties supported:
     * @param {String} [ifTrue] Value to return if *context* has or contains *propertyName*. If not defined, defaults to an empty string ("").
     * @param {String} [ifFalse] Value to return if *context* does not have or contain *propertyName*. If not defined, defaults to an empty string ("").
     * @returns {String|Function}
     */
    module.registerHelper("has", function (context, propertyName, options) {
        return genericDualHelper.call(this, options, function () {
            var output = false;
            if (_.isObject(context)) {
                if (_.isArray(context)) {
                    var result = _.find(context, function (element) {
                        return element == propertyName
                    });

                    if (!_.isUndefined(result)) {
                        output = true;
                    }
                } else if (_.has(context, propertyName)) {
                    output = true;
                }
            }

            return output;
        });
    });

    /**
     * __notHas__
     *
     * Inverse version of has helper.
     */
    module.registerHelper('notHas', function (context, options) {
        var fn = options.fn, inverse = options.inverse;
        options.fn = inverse;
        options.inverse = fn;

        return Handlebars.helpers['has'].call(this, context, options);
    });

    /**
     * __gt__
     *
     * Greater than inequality helper (a.k.a >, More than). Provides both block and inline helper functionality.
     *
     * If the *context* is a Number and greater than *compareObject*, in Inline mode returns *ifTrue*, otherwise returns
     * *ifFalse*; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).
     *
     * If the *context* is a String, Object or Array and its length is greater than *compareObject*, in Inline mode returns *ifTrue*, otherwise returns
     * *ifFalse*; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).
     *
     *     <!-- Inline mode -->
     *     <span>{{gt context "compareObject" ifTrue="Yay!" }}</span>
     *     <span>{{gt context "compareObject" ifTrue="Yay!" ifFalse="Boo!}}</span>
     *
     *     <!-- Block mode -->
     *     <select>
     *     {{#gt context "compareObject"}}
     *     <option>Yay!</option>
     *     {{/gt}}
     *     </select>
     *
     *     <select>
     *     {{#gt context "compareObject"}}
     *     <option>Yay!</option>
     *     {{else}}
     *     <option>Boo!</option>
     *     {{/gt}}
     *     </select>
     *
     * @param {Number|String|Array|Object} context Value to compare.
     * @param {Number|String} compareObject Value to compare object to. Must be a number or numeric string.
     * @param {Object} options options.hash properties supported:
     * @param {String} [ifTrue] Value to return if *context* is greater than *compareObject*. If not defined, defaults to an empty string ("").
     * @param {String} [ifFalse] Value to return if *context* is not greater than *compareObject*. If not defined, defaults to an empty string ("").
     * @returns {String|Function}
     */
    module.registerHelper("gt", function (context, compareObject, options) {
        return genericDualHelper.call(this, options, function () {
            var output = false;

            if (_.isString(context) || _.isArray(context)) {
                context = context.length;
            } else if (_.isObject(context)) {
                context = _.keys(context).length;
            }

            if (!_.isNaN(context) && _.isNumber(context) && _.isFinite(context)) {
                if (context > compareObject) {
                    output = true;
                }
            }

            return output;
        });
    });

    /**
     * __gte__
     *
     * Greater than or equal inequality helper (a.k.a >=, More than or equal). Provides both block and inline helper functionality.
     *
     * If the *context* is a Number and greater than or equal to *compareObject*, in Inline mode returns *ifTrue*, otherwise returns
     * *ifFalse*; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).
     *
     * If the *context* is a String, Object or Array and its length is greater than or equal to *compareObject*, in Inline mode returns *ifTrue*, otherwise returns
     * *ifFalse*; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).
     *
     *     <!-- Inline mode -->
     *     <span>{{gte context "compareObject" ifTrue="Yay!" }}</span>
     *     <span>{{gte context "compareObject" ifTrue="Yay!" ifFalse="Boo!}}</span>
     *
     *     <!-- Block mode -->
     *     <select>
     *     {{#gte context "compareObject"}}
     *     <option>Yay!</option>
     *     {{/gte}}
     *     </select>
     *
     *     <select>
     *     {{#gte context "compareObject"}}
     *     <option>Yay!</option>
     *     {{else}}
     *     <option>Boo!</option>
     *     {{/gte}}
     *     </select>
     *
     * @param {Number|String|Array|Object} context Value to compare.
     * @param {Number|String} compareObject Value to compare object to. Must be a number or numeric string.
     * @param {Object} options options.hash properties supported:
     * @param {String} [ifTrue] Value to return if *context* is greater than or equal to *compareObject*. If not defined, defaults to an empty string ("").
     * @param {String} [ifFalse] Value to return if *context* is not greater than or equal *compareObject*. If not defined, defaults to an empty string ("").
     * @returns {String|Function}
     */
    module.registerHelper("gte", function (context, compareObject, options) {
        return genericDualHelper.call(this, options, function () {
            var output = false;

            if (_.isString(context) || _.isArray(context)) {
                context = context.length;
            } else if (_.isObject(context)) {
                context = _.keys(context).length;
            }

            if (!_.isNaN(context) && _.isNumber(context) && _.isFinite(context)) {
                if (context >= compareObject) {
                    output = true;
                }
            }

            return output;
        });
    });

    /**
     * __lt__
     *
     * Less than inequality helper (a.k.a <). Provides both block and inline helper functionality.
     *
     * If the *context* is a Number and less than *compareObject*, in Inline mode returns *ifTrue*, otherwise returns
     * *ifFalse*; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).
     *
     * If the *context* is a String, Object or Array and its length is less than *compareObject*, in Inline mode returns *ifTrue*, otherwise returns
     * *ifFalse*; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).
     *
     *     <!-- Inline mode -->
     *     <span>{{lt context "compareObject" ifTrue="Yay!" }}</span>
     *     <span>{{lt context "compareObject" ifTrue="Yay!" ifFalse="Boo!}}</span>
     *
     *     <!-- Block mode -->
     *     <select>
     *     {{#lt context "compareObject"}}
     *     <option>Yay!</option>
     *     {{/lt}}
     *     </select>
     *
     *     <select>
     *     {{#lt context "compareObject"}}
     *     <option>Yay!</option>
     *     {{else}}
     *     <option>Boo!</option>
     *     {{/lt}}
     *     </select>
     *
     * @param {Number|String|Array|Object} context Value to compare.
     * @param {Number|String} compareObject Value to compare object to. Must be a number or numeric string.
     * @param {Object} options options.hash properties supported:
     * @param {String} [ifTrue] Value to return if *context* is greater than or equal to *compareObject*. If not defined, defaults to an empty string ("").
     * @param {String} [ifFalse] Value to return if *context* is not greater than or equal *compareObject*. If not defined, defaults to an empty string ("").
     * @returns {String|Function}
     */
    module.registerHelper("lt", function (context, compareObject, options) {
        return genericDualHelper.call(this, options, function () {
            var output = false;

            if (_.isString(context) || _.isArray(context)) {
                context = context.length;
            } else if (_.isObject(context)) {
                context = _.keys(context).length;
            }

            if (!_.isNaN(context) && _.isNumber(context) && _.isFinite(context)) {
                if (context < compareObject) {
                    output = true;
                }
            }

            return output;
        });
    });

    /**
     * __lte__
     *
     * Less than or equal inequality helper (a.k.a <). Provides both block and inline helper functionality.
     *
     * If the *context* is a Number and less than or equal to *compareObject*, in Inline mode returns *ifTrue*, otherwise returns
     * *ifFalse*; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).
     *
     * If the *context* is a String, Object or Array and its length is less than or equal to *compareObject*, in Inline mode returns *ifTrue*, otherwise returns
     * *ifFalse*; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).
     *
     *     <!-- Inline mode -->
     *     <span>{{lte context "compareObject" ifTrue="Yay!" }}</span>
     *     <span>{{lte context "compareObject" ifTrue="Yay!" ifFalse="Boo!}}</span>
     *
     *     <!-- Block mode -->
     *     <select>
     *     {{#lte context "compareObject"}}
     *     <option>Yay!</option>
     *     {{/lte}}
     *     </select>
     *
     *     <select>
     *     {{#lte context "compareObject"}}
     *     <option>Yay!</option>
     *     {{else}}
     *     <option>Boo!</option>
     *     {{/lte}}
     *     </select>
     *
     * @param {Number|String|Array|Object} context Value to compare.
     * @param {Number|String} compareObject Value to compare object to. Must be a number or numeric string.
     * @param {Object} options options.hash properties supported:
     * @param {String} [ifTrue] Value to return if *context* is greater than or equal to *compareObject*. If not defined, defaults to an empty string ("").
     * @param {String} [ifFalse] Value to return if *context* is not greater than or equal *compareObject*. If not defined, defaults to an empty string ("").
     * @returns {String|Function}
     */
    module.registerHelper("lte", function (context, compareObject, options) {
        return genericDualHelper.call(this, options, function () {
            var output = false;

            if (_.isString(context) || _.isArray(context)) {
                context = context.length;
            } else if (_.isObject(context)) {
                context = _.keys(context).length;
            }

            if (!_.isNaN(context) && _.isNumber(context) && _.isFinite(context)) {
                if (context <= compareObject) {
                    output = true;
                }
            }

            return output;
        });
    });

    return module;
});