/*jslint browser: true, plusplus: true, todo: true, nomen: true */

/* TODO: port to Web Audio API */

var define, Audio;

define(function () {
    "use strict";
    var
        i,
        context = new window.AudioContext(),
        click_sound = new Audio("sounds/click.wav"),
        oscillator = context.createOscillator(),
        gainNode = context.createGain();


	oscillator.connect(gainNode);
	// Gain and frequency values are empirical; there's nothing special about them.
	gainNode.gain.value = 0.16;
	oscillator.frequency.value = 940;
	oscillator.start();

	function beep(duration) {
		gainNode.connect(context.destination);
		setTimeout(function () {gainNode.disconnect(context.destination);}, duration);
	}

    return {
        play_countdown: function () {
			beep(250);
        },
        play_time_expired: function () {
			beep(1000);
        },
        play_click: function () {
			click_sound.play();
        }
    };
});
