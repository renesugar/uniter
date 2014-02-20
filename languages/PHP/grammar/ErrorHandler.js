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
    'languages/PHP/interpreter/Error/Parse'
], function (
    util,
    PHPParseError
) {
    'use strict';

    function ErrorHandler(stderr, state) {
        this.state = state;
        this.stderr = stderr;
    }

    util.extend(ErrorHandler.prototype, {
        handle: function (parseException) {
            var handler = this,
                furthestMatch = parseException.getFurthestMatch(),
                error = new PHPParseError(PHPParseError.SYNTAX_UNEXPECTED, {
                    'file': handler.state.getPath(),
                    'line': parseException.getLineNumber(),
                    'what': parseException.unexpectedEndOfInput() ? '$end' : '\'' + furthestMatch.components + '\''
                });

            if (handler.state.isMainProgram()) {
                handler.stderr.write(error.message);
            }

            throw error;
        }
    });

    return ErrorHandler;
});
