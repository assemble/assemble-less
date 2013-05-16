(function (tree) {

tree.Element = function (combinator, value, index) {
    this.combinator = combinator instanceof tree.Combinator ?
                      combinator : new(tree.Combinator)(combinator);

    if (typeof(value) === 'string') {
        this.value = value.trim();
    } else if (value) {
        this.value = value;
    } else {
        this.value = "";
    }
    this.index = index;
};
tree.Element.prototype = {
    type: "Element",
    accept: function (visitor) {
        this.combinator = visitor.visit(this.combinator);
        this.value = visitor.visit(this.value);
    },
    eval: function (env) {
        return new(tree.Element)(this.combinator,
                                 this.value.eval ? this.value.eval(env) : this.value,
                                 this.index);
    },
    toCSS: function (env) {
        var value = (this.value.toCSS ? this.value.toCSS(env) : this.value);
        if (value == '' && this.combinator.value.charAt(0) == '&') {
            return '';
        } else {
            return this.combinator.toCSS(env || {}) + value;
        }
    }
};

tree.Attribute = function (key, op, value) {
    this.key = key;
    this.op = op;
    this.value = value;
};
tree.Attribute.prototype = {
    type: "Attribute",
    accept: function (visitor) {
        this.value = visitor.visit(this.value);
    },
    eval: function (env) {
        return new(tree.Attribute)(this.key.eval ? this.key.eval(env) : this.key,
            this.op, (this.value && this.value.eval) ? this.value.eval(env) : this.value);
    },
    toCSS: function (env) {
        var value = this.key.toCSS ? this.key.toCSS(env) : this.key;

        if (this.op) {
            value += this.op;
            value += (this.value.toCSS ? this.value.toCSS(env) : this.value);
        }

        return '[' + value + ']';
    }
};

tree.NthChild = function (multiplierOrAddition, operator, addition) {
    this.multiplierOrAddition = multiplierOrAddition;
    this.operator = operator;
    this.addition = addition;
};
tree.NthChild.prototype = {
    type: "NthChild",
    accept: function (visitor) {
        this.multiplierOrAddition = visitor.visit(this.multiplierOrAddition);
        this.addition = visitor.visit(this.addition);
    },
    eval: function (env) {
        return new(tree.NthChild)(this.multiplierOrAddition.eval ? this.multiplierOrAddition.eval(env) : this.multiplierOrAddition,
            this.operator, (this.addition && this.addition.eval) ? this.addition.eval(env) : this.addition);
    },
    toCSS: function (env) {
        var value = (this.key.toCSS ? this.key.toCSS(env) : this.key);

        if (this.operator || this.addition) {
            value += "n";
        }

        if (this.operator) {
            value += this.operator;
        }

        if (this.addition) {
            value += (this.addition.toCSS ? this.addition.toCSS(env) : this.addition);
        }

        return '(' + value + ')';
    }
};

tree.Combinator = function (value) {
    if (value === ' ') {
        this.value = ' ';
    } else {
        this.value = value ? value.trim() : "";
    }
};
tree.Combinator.prototype = {
    type: "Combinator",
    toCSS: function (env) {
        return {
            ''  : '',
            ' ' : ' ',
            ':' : ' :',
            '+' : env.compress ? '+' : ' + ',
            '~' : env.compress ? '~' : ' ~ ',
            '>' : env.compress ? '>' : ' > ',
            '|' : env.compress ? '|' : ' | '
        }[this.value];
    }
};

})(require('../tree'));
