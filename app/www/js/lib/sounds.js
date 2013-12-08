/* TODO: port to Web Audio API */

define(function() {

	var output = new Audio();
	output.mozSetup(1, 44100);

	/* The short beep during countdown. */
	var samples_countdown = new Float32Array(11025);
	for (var i = 0; i < samples_countdown.length ; i++) {
		samples_countdown[i] = Math.sin( i / 15 );
	}

	/* The long beep after end of game. */
	var samples_time_expired = new Float32Array(44100);
	for (var i = 0; i < samples_time_expired.length ; i++) {
		samples_time_expired[i] = Math.sin( i / 15 );
	}

	var click_sound = new Audio("sounds/click.wav");

	return {
		play_countdown: function() {
			output.mozWriteAudio(samples_countdown);
		},
		play_time_expired: function() {
			output.mozWriteAudio(samples_time_expired);
		},
		play_click: function() {
			click_sound.play();
		}
	}
});
