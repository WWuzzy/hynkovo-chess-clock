/*jslint browser: true, plusplus: true, todo: true, nomen: true */

/* TODO: port to Web Audio API */

var define, Audio, Float32Array;

define(function () {
    "use strict";
    var
        i,
		output = new Audio(),
        samples_countdown = new Float32Array(11025),
        samples_time_expired = new Float32Array(44100),
        click_sound = new Audio("sounds/click.wav");

    output.mozSetup(1, 44100);

    /* The short beep during countdown. */
    for (i = 0; i < samples_countdown.length; i++) {
        samples_countdown[i] = Math.sin(i / 15);
    }

    /* The long beep after end of game. */
    for (i = 0; i < samples_time_expired.length; i++) {
        samples_time_expired[i] = Math.sin(i / 15);
    }

    return {
        play_countdown: function () {
            output.mozWriteAudio(samples_countdown);
        },
        play_time_expired: function () {
            output.mozWriteAudio(samples_time_expired);
        },
        play_click: function () {
            click_sound.play();
        }
    };
});
