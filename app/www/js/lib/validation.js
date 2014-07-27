/* Validate the numerical inputs in settings. */

/*jslint browser: true, plusplus: true, todo: true, nomen: true */

var define;

define(['zepto'], function ($) {
    "use strict";
    var supply_default, is_valid, validate_numerical;

    /* Replace an empty value with zero. */
    supply_default = function (input) {
        if (input.value === '') { input.value = '0'; }
    };

    is_valid = function (input) {
        var number = parseInt(input.value, 10);
        if (isNaN(number) || number < 0) { return false; }
        return true;
    };

    validate_numerical = function (inputs) {
        var validated = true, input, i;
        for (i = 0; i < inputs.length; i++) {
            input = inputs[i];
            supply_default(input);
            if (!is_valid(input)) {
                validated = false;
                $(input).addClass('invalid_input');
            } else { $(input).removeClass('invalid_input'); }
        }
        return validated;
    };

    return {
        validate_numerical: validate_numerical
    };
});
