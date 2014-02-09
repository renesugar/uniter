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
    'js/util'
], function (
    util
) {
    'use strict';

    var hasOwn = {}.hasOwnProperty;

    function NamespaceScope(globalNamespace, namespace) {
        this.globalNamespace = globalNamespace;
        this.imports = {};
        this.namespace = namespace;
    }

    util.extend(NamespaceScope.prototype, {
        getClass: function (name) {
            var match,
                scope = this,
                namespace = scope.namespace,
                path;

            if (name.charAt(0) === '\\') {
                match = name.match(/^\\(.*?)\\([^\\]+)$/);
                path = match[1];
                name = match[2];

                namespace = scope.globalNamespace.getDescendant(path);
            } else if (hasOwn.call(scope.imports, name)) {
                name = scope.imports[name];
                namespace = scope.globalNamespace;
            }

            return namespace.getClass(name);
        },

        getFunction: function (name) {
            return this.namespace.getFunction(name);
        },

        use: function (source, alias) {
            if (!alias) {
                alias = source.replace(/^.*?([^\\])$/, '$1');
            }

            this.imports[alias] = source;
        }
    });

    return NamespaceScope;
});
