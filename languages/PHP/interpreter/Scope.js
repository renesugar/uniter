/*
 * Uniter - JavaScript PHP interpreter
 * Copyright 2013 Dan Phillimore (asmblah)
 * http://asmblah.github.com/uniter/
 *
 * Released under the MIT license
 * https://github.com/asmblah/uniter/raw/master/MIT-LICENSE.txt
 */

/*global define */
define([
    'js/util',
    './Error',
    './Variable'
], function (
    util,
    PHPError,
    Variable
) {
    'use strict';

    var hasOwn = {}.hasOwnProperty;

    function Scope(valueFactory) {
        this.errorsSuppressed = false;
        this.valueFactory = valueFactory;
        this.variables = {};
    }

    util.extend(Scope.prototype, {
        defineVariables: function (names) {
            var scope = this;

            util.each(names, function (name) {
                scope.variables[name] = new Variable(scope.valueFactory);
            });
        },

        getVariable: function (name, scopeChain) {
            var scope = this;

            if (!hasOwn.call(scope.variables, name)) {
                scopeChain.raiseError(PHPError.E_NOTICE, 'Undefined variable: ' + name);

                // Implicitly define the variable
                scope.variables[name] = new Variable(scope.valueFactory);
            }

            return scope.variables[name];
        },

        suppressesErrors: function () {
            return this.errorsSuppressed;
        }
    });

    return Scope;
});