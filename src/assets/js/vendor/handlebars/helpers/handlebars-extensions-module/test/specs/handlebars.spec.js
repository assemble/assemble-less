define([
    'underscore.module',
    'handlebars.extensions'
], function (_, Handlebars) {
    ////// UTILS ////////
    /**
     *
     * @param helperName
     * @param test
     * @param testValue {*}  Right-side of the conditional evaluation (e.g. "#if left-side right-side" )
     * @param options
     */
    var expectContextToBePassedToBlockHelper = function ( helperName, test, testValue, options ) {
        // Define optional defaults
        options = _.extend({
            includeElse: false,
            expectInverse: false
        },options);

        var _inverse = options.includeElse === true ? '{{else}}{{inverseValue}}' : '';
        var _context = { test: test, value: 'Yay!', inverseValue: 'Boo!'};

        var _source = '<span>{{#'+helperName+' test "'+testValue+'"}}{{value}}'+_inverse+'{{/'+helperName+'}}</span>';
        var _template = Handlebars.compile(_source);

        // Determine which value is the expected
        var _expected = options.expectInverse ? _context.inverseValue : _context.value;

        expect(_template(_context)).toEqual('<span>'+_expected+'</span>');
    };

    ////// TESTS ///////
    describe("Handlebars extensions module", function () {
        var source, template;

        // toString
        describe("toString helper", function () {
            beforeEach(function () {
                source = '<span>{{toString test}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a null property to be an empty string", function () {
                var context = { test:null };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an undefined property to be an empty string", function () {
                var context = { test:void 0 };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an empty object property to be an empty string", function () {
                var context = { test:{} };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an empty array property to be an empty string", function () {
                var context = { test:[] };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a non-empty string property to be a string", function () {
                var context = { test:"lorem ipsum" };
                var expected = '<span>lorem ipsum</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a number property to be a string", function () {
                var context = { test:123 };
                var expected = '<span>123</span>';
                expect(template(context)).toEqual(expected);
            });
        });

        // eq
        describe("eq inline helper", function () {
            it("expect string property that equals argument to return the correct output", function () {
                var source = '<span>{{eq test "test"}}</span>';
                var template = Handlebars.compile(source);
                var context = { test:"test" };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect string property that does not equal argument to return the correct output", function () {
                var source = '<span>{{eq test "test"}}</span>';
                var template = Handlebars.compile(source);
                var context = { test:"nottest" };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });
        });

        describe("eq inline with optional arguments", function () {
            it("expect string property with ifTrue argument set, to return the correct output", function () {
                var source = '<span>{{eq test "test" ifTrue="Yay!"}}</span>';
                var template = Handlebars.compile(source);
                expect(template({ test:"test" })).toEqual('<span>Yay!</span>');
                expect(template({ test:"nottest" })).toEqual('<span></span>');
            });

            it("expect string property with ifFalse argument set, to return the correct output", function () {
                var source = '<span>{{eq test "test" ifFalse="Boo!"}}</span>';
                var template = Handlebars.compile(source);
                expect(template({ test:"test" })).toEqual('<span></span>');
                expect(template({ test:"nottest" })).toEqual('<span>Boo!</span>');
            });

            it("expect string property with ifTrue and ifFalse arguments set, to return the correct output", function () {
                var source = '<span>{{eq test "test" ifTrue="Yay!" ifFalse="Boo!"}}</span>';
                var template = Handlebars.compile(source);
                expect(template({ test:"test" })).toEqual('<span>Yay!</span>');
                expect(template({ test:"nottest" })).toEqual('<span>Boo!</span>');
            });

            it("expect number property with ifTrue argument set, to return the correct output", function () {
                var source = '<span>{{eq test 1337 ifTrue="Yay!"}}</span>';
                var template = Handlebars.compile(source);
                expect(template({ test:1337 })).toEqual('<span>Yay!</span>');
                expect(template({ test:"1337" })).toEqual('<span>Yay!</span>');
                expect(template({ test:"nottest" })).toEqual('<span></span>');
            });

            it("expect number property with ifFalse argument set, to return the correct output", function () {
                var source = '<span>{{eq test 1337 ifFalse="Boo!"}}</span>';
                var template = Handlebars.compile(source);
                expect(template({ test:1337 })).toEqual('<span></span>');
                expect(template({ test:"1337" })).toEqual('<span></span>');
                expect(template({ test:"nottest" })).toEqual('<span>Boo!</span>');
            });

            it("expect number property with ifTrue and ifFalse arguments set, to return the correct output", function () {
                var source = '<span>{{eq test 1337 ifTrue="Yay!" ifFalse="Boo!"}}</span>';
                var template = Handlebars.compile(source);
                expect(template({ test:1337 })).toEqual('<span>Yay!</span>');
                expect(template({ test:"1337" })).toEqual('<span>Yay!</span>');
                expect(template({ test:"nottest" })).toEqual('<span>Boo!</span>');
            });

            it("expect numeric property with ifTrue argument set, to return the correct output", function () {
                var source = '<span>{{eq test "1337" ifTrue="Yay!"}}</span>';
                var template = Handlebars.compile(source);
                expect(template({ test:1337 })).toEqual('<span>Yay!</span>');
                expect(template({ test:"1337" })).toEqual('<span>Yay!</span>');
                expect(template({ test:"nottest" })).toEqual('<span></span>');
            });

            it("expect numeric property with ifFalse argument set, to return the correct output", function () {
                var source = '<span>{{eq test "1337" ifFalse="Boo!"}}</span>';
                var template = Handlebars.compile(source);
                expect(template({ test:1337 })).toEqual('<span></span>');
                expect(template({ test:"1337" })).toEqual('<span></span>');
                expect(template({ test:"nottest" })).toEqual('<span>Boo!</span>');
            });

            it("expect numeric property with ifTrue and ifFalse arguments set, to return the correct output", function () {
                var source = '<span>{{eq test "1337" ifTrue="Yay!" ifFalse="Boo!"}}</span>';
                var template = Handlebars.compile(source);
                expect(template({ test:1337 })).toEqual('<span>Yay!</span>');
                expect(template({ test:"1337" })).toEqual('<span>Yay!</span>');
                expect(template({ test:"nottest" })).toEqual('<span>Boo!</span>');
            });
        });

        describe("eq block helper with else functionality", function () {
            beforeEach(function () {
                source = '<span>{{#eq test "i am a banana!"}}Yay!{{else}}Boo!{{/eq}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect an empty object to return the correct output", function () {
                var context = {};
                var expected = '<span>Boo!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an object with a property to return the correct output", function () {
                var context = { test:"i am a banana!" };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            // The beforeEach variables are having to be re-defined (code-smell)
            it("expect the context is passed on into the block", function ()  {
                expectContextToBePassedToBlockHelper.call(this, 'eq', 'i am a banana!', 'i am a banana!', {includeElse:true});
            });

            // The beforeEach variables are having to be re-defined (code-smell)
            it("expect the context is passed on into the block for inverse", function ()  {
                expectContextToBePassedToBlockHelper.call(this, 'eq', 'i am a banana!', 'i am not a banana!', {includeElse:true, expectInverse:true});
            });
        });

        describe("eq block helper without else functionality", function () {
            beforeEach(function () {
                source = '<span>{{#eq test "i am a banana!"}}Yay!{{/eq}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect an empty object to return the correct output", function () {
                var context = {};
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an object with a property to return the correct output", function () {
                var context = { test:"i am a banana!" };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            // The beforeEach variables are having to be re-defined (code-smell)
            it("expect the context is passed on into the block", function ()  {
                expectContextToBePassedToBlockHelper.call(this, 'eq', 'i am a banana!', 'i am a banana!');
            });
        });

        // has
        describe("has inline helper", function () {
            beforeEach(function () {
                source = '<span>{{has target "test"}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect an empty object to return the correct output", function () {
                var context = { target:{} };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an object with a property to return the correct output", function () {
                var context = { target:{ test:"i am a banana!" } };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });
        });

        describe("has inline helper with optional arguments", function () {
            beforeEach(function () {
                source = '<span>{{has target "test" ifTrue="Yay!" ifFalse="Boo!"}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect an empty object to return the correct output", function () {
                var context = { target:{} };
                var expected = '<span>Boo!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an object with a property to return the correct output", function () {
                var context = { target:{ test:"i am a banana!" } };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });
        });

        describe("has block helper with else functionality", function () {
            beforeEach(function () {
                source = '<span>{{#has target "test"}}Yay!{{else}}Boo!{{/has}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect an empty object to return the correct output", function () {
                var context = { target:{} };
                var expected = '<span>Boo!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an object with a property to return the correct output", function () {
                var context = { target:{ test:"i am a banana!" } };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            // The beforeEach variables are having to be re-defined (code-smell)
            it("expect the context is passed on into the block", function () {
                var context = { target:{ test:"i am a banana!", name: 'Banana Grabber'} };
                var expected = '<span>'+context.target.name+'</span>';
                // Modify the source before running since we are checking that the context is passed on
                source = '<span>{{#has target "test"}}{{target.name}}{{else}}Boo!{{/has}}</span>';
                // ... let's recompile too
                template = Handlebars.compile(source);
                // expect the baby
                expect(template(context)).toEqual(expected);
            });
        });

        describe("has block helper without else functionality", function () {
            beforeEach(function () {
                source = '<span>{{#has target "test"}}Yay!{{/has}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect an empty object to return the correct output", function () {
                var context = { target:{} };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an object with a property to return the correct output", function () {
                var context = { target:{ test:"i am a banana!" } };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });
        });

        // gt
        describe("gt inline helper", function () {
            beforeEach(function () {
                source = '<span>{{gt target "10"}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });
        });

        describe("gt inline helper with incorrect arguments", function () {
            beforeEach(function () {
                source = '<span>{{gt target "bobby" ifTrue="Yay!" ifFalse="Boo!"}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span>Boo!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span>Boo!</span>';
                expect(template(context)).toEqual(expected);
            });
        });

        describe("gt inline helper with optional arguments", function () {
            beforeEach(function () {
                source = '<span>{{gt target 10 ifTrue="Yay!" ifFalse="Boo!"}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span>Boo!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an array to return the correct output", function () {
                expect(template({ target:[1, 2, 3, 4, 5] })).toEqual('<span>Boo!</span>');
                expect(template({ target:[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1] })).toEqual('<span>Yay!</span>');
            });
            it("expect an object to return the correct output", function () {
                expect(template({ target:{ one:1, two:2, three:3} })).toEqual('<span>Boo!</span>');
                expect(template({ target:{ one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10, eleven:11} })).toEqual('<span>Yay!</span>');
            });
        });

        describe("gt block helper with else functionality", function () {
            beforeEach(function () {
                source = '<span>{{#gt target "10"}}Yay!{{else}}Boo!{{/gt}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span>Boo!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect the context is passed on into the block", function ()  {
                expectContextToBePassedToBlockHelper.call(this, 'gt', 50, 20, {includeElse:true});
            });

            it("expect the context is passed on into the block for inverse", function ()  {
                expectContextToBePassedToBlockHelper.call(this, 'gt', 10, 20, {expectInverse:true, includeElse:true});
            });
        });

        describe("gt block helper without else functionality", function () {
            beforeEach(function () {
                source = '<span>{{#gt target 10}}Yay!{{/gt}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect the context is passed on into the block", function ()  {
                expectContextToBePassedToBlockHelper.call(this, 'gt', 50, 20, {includeElse:false});
            });
        });

        // gte
        describe("gte inline helper", function () {
            beforeEach(function () {
                source = '<span>{{gte target "10"}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an equal number to return the correct output", function () {
                var context = { target:10 };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });
        });

        describe("gte inline helper with incorrect arguments", function () {
            beforeEach(function () {
                source = '<span>{{gte target "bobby" ifTrue="Yay!" ifFalse="Boo!"}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span>Boo!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span>Boo!</span>';
                expect(template(context)).toEqual(expected);
            });
        });

        describe("gte inline helper with optional arguments", function () {
            beforeEach(function () {
                source = '<span>{{gte target 10 ifTrue="Yay!" ifFalse="Boo!"}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span>Boo!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an equal number to return the correct output", function () {
                var context = { target:10 };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an array to return the correct output", function () {
                expect(template({ target:[1, 2, 3, 4, 5] })).toEqual('<span>Boo!</span>');
                expect(template({ target:[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1] })).toEqual('<span>Yay!</span>');
            });
            it("expect an object to return the correct output", function () {
                expect(template({ target:{ one:1, two:2, three:3} })).toEqual('<span>Boo!</span>');
                expect(template({ target:{ one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10, eleven:11} })).toEqual('<span>Yay!</span>');
            });
        });

        describe("gte block helper with else functionality", function () {
            beforeEach(function () {
                source = '<span>{{#gte target "10"}}Yay!{{else}}Boo!{{/gte}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span>Boo!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an equal number to return the correct output", function () {
                var context = { target:10 };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect the context is passed on into the block", function ()  {
               expectContextToBePassedToBlockHelper.call(this, 'gte', 50, 50, {includeElse:true});
            });

            it("expect the context is passed on into the block for inverse", function ()  {
               expectContextToBePassedToBlockHelper.call(this, 'gte', 10, 20, {expectInverse:true, includeElse:true});
            });
        });

        describe("gte block helper without else functionality", function () {
            beforeEach(function () {
                source = '<span>{{#gte target 10}}Yay!{{/gte}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an equal number to return the correct output", function () {
                var context = { target:10 };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect the context is passed on into the block", function ()  {
                expectContextToBePassedToBlockHelper.call(this, 'gte', 50, 50, {includeElse:false});
            });
        });

        // lt
        describe("lt inline helper", function () {
            beforeEach(function () {
                source = '<span>{{lt target "10"}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });
        });

        describe("lt inline helper with incorrect arguments", function () {
            beforeEach(function () {
                source = '<span>{{lt target "bobby" ifTrue="Yay!" ifFalse="Boo!"}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span>Boo!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span>Boo!</span>';
                expect(template(context)).toEqual(expected);
            });
        });

        describe("lt inline helper with optional arguments", function () {
            beforeEach(function () {
                source = '<span>{{lt target 10 ifTrue="Yay!" ifFalse="Boo!"}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span>Boo!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an array to return the correct output", function () {
                expect(template({ target:[1, 2, 3, 4, 5] })).toEqual('<span>Yay!</span>');
                expect(template({ target:[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1] })).toEqual('<span>Boo!</span>');
            });
            it("expect an object to return the correct output", function () {
                expect(template({ target:{ one:1, two:2, three:3} })).toEqual('<span>Yay!</span>');
                expect(template({ target:{ one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10, eleven:11} })).toEqual('<span>Boo!</span>');
            });
        });

        describe("lt block helper with else functionality", function () {
            beforeEach(function () {
                source = '<span>{{#lt target "10"}}Yay!{{else}}Boo!{{/lt}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span>Boo!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect the context is passed on into the block", function ()  {
                expectContextToBePassedToBlockHelper.call(this, 'lt', 20, 50, {includeElse:true});
            });

            it("expect the context is passed on into the block for inverse", function ()  {
                expectContextToBePassedToBlockHelper.call(this, 'lt', 20, 10, {expectInverse:true, includeElse:true});
            });
        });

        describe("lt block helper without else functionality", function () {
            beforeEach(function () {
                source = '<span>{{#lt target 10}}Yay!{{/lt}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect the context is passed on into the block ", function ()  {
                expectContextToBePassedToBlockHelper.call(this, 'lt', 20, 50, {includeElse:false});
            });
        });

        // lte
        describe("lte inline helper", function () {
            beforeEach(function () {
                source = '<span>{{lte target "10"}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an equal number to return the correct output", function () {
                var context = { target:10 };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });
        });

        describe("lte inline helper with incorrect arguments", function () {
            beforeEach(function () {
                source = '<span>{{lte target "bobby" ifTrue="Yay!" ifFalse="Boo!"}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span>Boo!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span>Boo!</span>';
                expect(template(context)).toEqual(expected);
            });
        });

        describe("lte inline helper with optional arguments", function () {
            beforeEach(function () {
                source = '<span>{{lte target 10 ifTrue="Yay!" ifFalse="Boo!"}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an equal number to return the correct output", function () {
                var context = { target:10 };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span>Boo!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an array to return the correct output", function () {
                expect(template({ target:[1, 2, 3, 4, 5] })).toEqual('<span>Yay!</span>');
                expect(template({ target:[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1] })).toEqual('<span>Boo!</span>');
            });

            it("expect an object to return the correct output", function () {
                expect(template({ target:{ one:1, two:2, three:3} })).toEqual('<span>Yay!</span>');
                expect(template({ target:{ one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10, eleven:11} })).toEqual('<span>Boo!</span>');
            });
        });

        describe("lte block helper with else functionality", function () {
            beforeEach(function () {
                source = '<span>{{#lte target "10"}}Yay!{{else}}Boo!{{/lte}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an equal number to return the correct output", function () {
                var context = { target:10 };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span>Boo!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect the context is passed on into the block", function ()  {
                expectContextToBePassedToBlockHelper.call(this, 'lte', 20, 20, {includeElse:true});
            });

            it("expect the context is passed on into the block", function ()  {
                expectContextToBePassedToBlockHelper.call(this, 'lte', 50, 20, {includeElse:true, expectInverse:true});
            });
        });

        describe("lte block helper without else functionality", function () {
            beforeEach(function () {
                source = '<span>{{#lte target 10}}Yay!{{/lte}}</span>';
                template = Handlebars.compile(source);
            });

            it("expect a smaller number to return the correct output", function () {
                var context = { target:5 };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect an equal number to return the correct output", function () {
                var context = { target:10 };
                var expected = '<span>Yay!</span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect a greater number to return the correct output", function () {
                var context = { target:50 };
                var expected = '<span></span>';
                expect(template(context)).toEqual(expected);
            });

            it("expect the context is passed on into the block", function ()  {
                expectContextToBePassedToBlockHelper.call(this, 'lte', 10, 20, {includeElse:false});
            });
        });
    });
});
