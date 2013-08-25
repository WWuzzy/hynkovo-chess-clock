// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

/* TODO: do not have a setInterval running all the time?
 * Increment. */

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
		initial_time: INITIAL_TIME, /* Customizable by the user. */
		timer1: {value: INITIAL_TIME},
		timer2: {value: INITIAL_TIME},
	};

	/* Register click functions on the individual players'
	 * clocks. */

	getRunningTimer = function() {return state[state.which[0]];}
	getRunningClock = function() {return $('#'+state.which[1]);}

	update = function() { /* This function gets called every <PERIOD> miliseconds. */
		if (state.state != STATE_TIMER1_RUNNING && /* Currently not running. */
			state.state != STATE_TIMER2_RUNNING) { return; }

		if (state.state == STATE_TIMER1_RUNNING) {
			timer = state.timer1;
			clock = $('#clock1');
		}
		else if (state.state == STATE_TIMER2_RUNNING) {
			timer = state.timer2;
			clock = $('#clock2');
		}
		timer.value -= PERIOD;
		var seconds_total = timer.value / 1000;
		var minutes = Math.round((seconds_total - seconds_total % 60)/60);
		var seconds = Math.floor(seconds_total - 60 * minutes);
		if (seconds < 10) { seconds = '0' + seconds;};
		clock.html(minutes + ':' + seconds);
	}


	$('#clock1').click(function() {
		if (state.state == STATE_TIMER1_RUNNING || state.state == STATE_INIT) {
			$('#clock1').removeClass('active');
			$('#clock2').addClass('active');
			state.state = STATE_TIMER2_RUNNING;
		}
	})

	$('#clock2').click(function() {
		if (state.state == STATE_TIMER2_RUNNING || state.state == STATE_INIT) {
			$('#clock2').removeClass('active');
			$('#clock1').addClass('active');
			state.state = STATE_TIMER1_RUNNING;
		}
	})

    $('#pausebutton').click(function() {
		switch(state.state) {
			case STATE_TIMER1_PAUSED:
				state.state = STATE_TIMER1_RUNNING;
				$('#pausebutton').css('background', 'green');
				break;
			case STATE_TIMER2_PAUSED:
				state.state = STATE_TIMER2_RUNNING;
				$('#pausebutton').css('background', 'green');
				break;
			case STATE_TIMER1_RUNNING:
				state.state = STATE_TIMER1_PAUSED;
				$('#pausebutton').css('background', 'red');
				break;
			case STATE_TIMER2_RUNNING:
				state.state = STATE_TIMER2_PAUSED;
				$('#pausebutton').css('background', 'red');
				break;
		}
	})

	/* Start the loop. */
	window.setInterval(update, PERIOD);
});
