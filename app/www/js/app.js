// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

/* TODO:
	- Do not have a setInterval running all the time?
	- Save and load used settings.
	- There's a 1-second inconsistency somewhere
*/

define(['zepto', 'sounds', 'validation'], function($, sounds, validation) {

	var PERIOD = 100;

	/* Define the possible states the clocks can be in. */
	var STATE_INIT = 1;
	var STATE_TIMER1_RUNNING = 2;
	var STATE_TIMER2_RUNNING = 3;
	var STATE_TIMER1_PAUSED = 4;
	var STATE_TIMER2_PAUSED = 5;
	var STATE_FINISHED = 6;

	var state = {
		state: STATE_INIT,
		timer1: {value: 0}, // Set by the init function (together with timer2).
		timer2: {value: 0},
		lock: null // screen WakeLock, if required.
	};

	var settings = { /* Editable from the GUI */
		initial_time: 1000 * 5 * 60,
		increment: 5000,
		enable_sound: true
	}


	acquire_wakelock = function() {
		/* Acquire a WakeLock on the screen. */
		if (window.navigator.requestWakeLock) { // Check if the feature is available.
			if (!state.lock) { // Check if the WakeLock hasn't been obtained already.
				state.lock = window.navigator.requestWakeLock('screen');
			}
		};
	};

	release_wakelock = function() {
		/* Release the WakeLock and remove it from state. */
		if (state.lock) {
			state.lock.unlock();
			state.lock = null;
		};
	};

	init = function () { /* Restart using the current settings. */
		state.state = STATE_INIT;
		state.timer1.value = settings.initial_time;
		state.timer2.value = settings.initial_time;
		timer_to_clock(state.timer1, '#clock1');
		timer_to_clock(state.timer2, '#clock2');
		$('#pausebutton').attr('src', 'img/Play.png');
		$('#clock1').removeClass('active');
		$('#clock2').removeClass('active');
		$('#clock1').css('color', '#dddddd');
		$('#clock2').css('color', '#dddddd');
	};

	timer_to_clock = function(timer, clock_selector) {
		var seconds_total = (timer.value + 999) / 1000;
		// By adding 999 ms, we shifted the clock by 1 second in
		// order for the clock not to show zero seconds during
		// the last second. At the same time, we are avoiding
		// showing too large values both at the beginning and at
		// the end.
		var minutes = Math.round((seconds_total - seconds_total % 60)/60);
		var seconds = Math.floor(seconds_total - 60 * minutes);
		if (seconds < 10) { seconds = '0' + seconds;};
		$(clock_selector + ' .timer').html( minutes + ':' + seconds);
	}


	update = function() { /* This function gets called every <PERIOD> miliseconds. */
		if (state.state != STATE_TIMER1_RUNNING && /* Currently not running. */
			state.state != STATE_TIMER2_RUNNING) { return; }

		if (state.state == STATE_TIMER1_RUNNING) {
			timer = state.timer1;
			clock = '#clock1';
		}
		else if (state.state == STATE_TIMER2_RUNNING) {
			timer = state.timer2;
			clock = '#clock2';
		}
		timer.value -= PERIOD;
		if (timer.value <= 0) {
			finish(clock);
		}
		timer_to_clock(timer, clock);
		beep_if_appropriate(timer);
	}

	finish = function(clock_selector) {
		state.state = STATE_FINISHED;
		$(clock_selector).css('color', 'red');
		$('#pausebutton').attr('src', 'img/Play.png');
		release_wakelock();
	}

	beep_if_appropriate = function(timer) {
		if (!settings.enable_sound)
			return;

		// Long beep when the time is out.
		if (timer.value <= 0) {
			setTimeout(sounds.play_time_expired, 10); // Ensure asynchronous execution.
			return;
		}

		// Short beep 1s, 2s, 3s, and 4s before end.
		beep_vals = [1000, 2000, 3000, 4000];
		for (var i = 0; i < beep_vals.length ; i++) {
			if (timer.value == beep_vals[i]) {
				setTimeout(sounds.play_countdown, 10); // Ensure asynchronous execution.
				break;
			}
		}
	}

	/* Register tap functions on the individual players'
	 * clocks. */

	$('#clock1').tap(function() {
		if (state.state == STATE_INIT) { // We're starting to play.
			$('#pausebutton').attr('src', 'img/Pause.png');
			acquire_wakelock();
		}
		if (state.state == STATE_TIMER1_RUNNING || state.state == STATE_INIT) {
			$('#clock1').removeClass('active');
			$('#clock2').addClass('active');
			state.timer2.value += settings.increment;
			state.state = STATE_TIMER2_RUNNING;
			if (settings.enable_sound) {
				setTimeout(sounds.play_click, 2); // Ensure asynchronous execution.
			}
		}
	});

	$('#clock2').tap(function() {
		if (state.state == STATE_INIT) { // We're starting to play.
			$('#pausebutton').attr('src', 'img/Pause.png');
			acquire_wakelock();
		}
		if (state.state == STATE_TIMER2_RUNNING || state.state == STATE_INIT) {
			$('#clock2').removeClass('active');
			$('#clock1').addClass('active');
			state.timer1.value += settings.increment;
			state.state = STATE_TIMER1_RUNNING;
			if (settings.enable_sound) {
				setTimeout(sounds.play_click, 2); // Ensure asynchronous execution.
			}
		}
	});

	pausebutton_tap = function() {
		switch(state.state) {
			case STATE_TIMER1_PAUSED:
				state.state = STATE_TIMER1_RUNNING;
				$('#pausebutton').attr('src', 'img/Pause.png');
				acquire_wakelock();
				break;
			case STATE_TIMER2_PAUSED:
				state.state = STATE_TIMER2_RUNNING;
				$('#pausebutton').attr('src', 'img/Pause.png');
				acquire_wakelock();
				break;
			case STATE_TIMER1_RUNNING:
				state.state = STATE_TIMER1_PAUSED;
				$('#pausebutton').attr('src', 'img/Play.png');
				release_wakelock();
				break;
			case STATE_TIMER2_RUNNING:
				state.state = STATE_TIMER2_PAUSED;
				$('#pausebutton').attr('src', 'img/Play.png');
				release_wakelock();
				break;
		}
	}

    $('#pausebutton').tap(function() {
		pausebutton_tap();
	});

	$('#settingsbutton').tap(function() {
		if (state.state == STATE_TIMER1_RUNNING || state.state == STATE_TIMER2_RUNNING) {
			pausebutton_tap();
		}
		$('#time').css('display', 'none');
		$('#settings').css('display', 'block');
	})


	/* Settings section */

	$('#use_settings_button').tap(function() {
		if (!validation.validate_numerical($('input[type=number]'))) {
			return; // Validation handles also the error display.
		};
		minutes = parseInt($('#minutes').val());
		seconds = parseInt($('#seconds').val());
		settings.initial_time = 1000 * (minutes * 60 + seconds);
		settings.increment = 1000 * parseInt($('#increment').val());
		settings.enable_sound = $('#enable_sound').prop('checked');
		init();
		$('#settings').css('display', 'none');
		$('#time').css('display', 'block');
	});

	$('#cancel_settings_button').tap(function() {
		$('#settings').css('display', 'none');
		$('#time').css('display', 'block');
		$('input').removeClass('invalid_input');
	});


	/* Convert tap to click for non-touch devices. */

	(function($) {
	    if (!('ontouchend' in window)) { // Only do this if not on a touch device.
	        $(document).delegate('body', 'click', function(e) {
	            $(e.target).trigger('tap');
	        });
	    }
	})($);

	/* Populate the state and start the loop. */
	init();
	window.setInterval(update, PERIOD);

});
