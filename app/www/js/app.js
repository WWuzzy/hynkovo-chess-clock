// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

/* TODO: do not have a setInterval running all the time?
 * Increment. Validate settings input (must be integer.) Beep
 * upon finish. */

define(function(require) {
	var $ = require('zepto');

	var PERIOD = 100;
	var INITIAL_TIME = 5*60*1000; /* TODO: Read this from last time settings. */

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
	};

	var settings = { /* Editable from the GUI */
		initial_time: 1000 * 5 * 60,
		increment: 5000,
	}

	init = function () { /* Restart using the current settings. */
		state.state = STATE_INIT;
		state.timer1.value = settings.initial_time;
		state.timer2.value = settings.initial_time;
		timer_to_clock(state.timer1, '#clock1');
		timer_to_clock(state.timer2, '#clock2');
		$('#pausebutton').attr('src', '/img/Pause.png');
		$('#clock1').removeClass('active');
		$('#clock2').removeClass('active');
	};

	timer_to_clock = function(timer, clock_selector) {
		var seconds_total = timer.value / 1000;
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
		timer_to_clock(timer, clock);
	}

	/* Register click functions on the individual players'
	 * clocks. */

	$('#clock1').click(function() {
		if (state.state == STATE_TIMER1_RUNNING || state.state == STATE_INIT) {
			$('#clock1').removeClass('active');
			$('#clock2').addClass('active');
			state.timer2.value += settings.increment;
			state.state = STATE_TIMER2_RUNNING;
		}
	});

	$('#clock2').click(function() {
		if (state.state == STATE_TIMER2_RUNNING || state.state == STATE_INIT) {
			$('#clock2').removeClass('active');
			$('#clock1').addClass('active');
			state.timer1.value += settings.increment;
			state.state = STATE_TIMER1_RUNNING;
		}
	});

	pausebutton_click = function() {
		switch(state.state) {
			case STATE_TIMER1_PAUSED:
				state.state = STATE_TIMER1_RUNNING;
				$('#pausebutton').attr('src', '/img/Pause.png');
				break;
			case STATE_TIMER2_PAUSED:
				state.state = STATE_TIMER2_RUNNING;
				$('#pausebutton').attr('src', '/img/Pause.png');
				break;
			case STATE_TIMER1_RUNNING:
				state.state = STATE_TIMER1_PAUSED;
				$('#pausebutton').attr('src', '/img/Play.png');
				break;
			case STATE_TIMER2_RUNNING:
				state.state = STATE_TIMER2_PAUSED;
				$('#pausebutton').attr('src', '/img/Play.png');
				break;
		}
	}

    $('#pausebutton').click(function() {
		pausebutton_click();
	});

	$('#settingsbutton').click(function() {
		if (state.state == STATE_TIMER1_RUNNING || state.state == STATE_TIMER2_RUNNING) {
			pausebutton_click();
		}
		$('#time').css('display', 'none');
		$('#settings').css('display', 'block');
	})


	/* Settings section */

	$('#use_settings_button').click(function() {
		minutes = parseInt($('#minutes').val());
		seconds = parseInt($('#seconds').val());
		settings.initial_time = 1000 * (minutes * 60 + seconds);
		settings.increment = 1000 * parseInt($('#increment').val());
		init();
		$('#settings').css('display', 'none');
		$('#time').css('display', 'block');
	});

	$('#cancel_button').click(function() {
		$('#settings').css('display', 'none');
		$('#time').css('display', 'block');
	});

	/* Populate the state and start the loop. */
	init();
	window.setInterval(update, PERIOD);

});
