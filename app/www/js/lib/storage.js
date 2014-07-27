/* Functions to work with localStorage. */

/*jslint browser: true, plusplus: true, todo: true, nomen: true */

var define;

define([], function () {
    "use strict";
    function shallow_copy(obj) {
        /* Simple shallow copy. */
        var obj_copy = {}, prop;
        for (prop in obj) {
            obj_copy[prop] = obj[prop];
        }
        return obj_copy;
    }

    return {
        load_settings: function () {
            var settings;
            if (!localStorage.settings) {
                return null;
            }
            settings = JSON.parse(localStorage.settings);
            // Do not propagate the version information outside
            // of this module.
            if (settings.hasOwnProperty('_version')) {
                delete settings._version;
            }
            return settings;
        },

        save_settings: function (settings) {
            // Augment with version information to allow for future data
            // migrations, should they be necessary.
            var versioned_settings = shallow_copy(settings);
            versioned_settings._version = 1;
            localStorage.settings = JSON.stringify(versioned_settings);
        }
    };
});
