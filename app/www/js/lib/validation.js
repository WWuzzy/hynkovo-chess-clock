/* Validate the numerical inputs in settings. */

define(['zepto'], function($) {

		/* Replace an empty value with zero. */
		supply_default = function(input) {
			if (input.value == '') {input.value = '0'};
		};

		is_valid = function(input) {
			number = parseInt(input.value);
			if (isNaN(number) || number < 0) {return false} else {return true};
		};

		validate_settings = function(inputs) {
			validated = true;
			for (var i = 0; i < inputs.length; i++) {
				input = inputs[i];
				supply_default(input);
				if (!is_valid(input)) {
					validated = false;
					$(input).addClass('invalid_input');
				} else {$(input).removeClass('invalid_input')};
			}
			return validated;
		};
		
		return {
				validate_settings: validate_settings
		}

});
