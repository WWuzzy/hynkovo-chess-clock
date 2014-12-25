/*jslint browser: true, plusplus: true, todo: true, nomen: true */

var define;

define(function () {
    "use strict";
    var
        context = new window.AudioContext(),
        oscillator = context.createOscillator(),
        gainNode = context.createGain(),
        click_request = new XMLHttpRequest(),
        click_sound_buffer;


    // -- > Create and start the oscilator for beeping sounds.
    oscillator.connect(gainNode);
    // Gain and frequency values are empirical; there's nothing special about them.
    gainNode.gain.value = 0.16;
    oscillator.frequency.value = 940;
    oscillator.start();
    // < --

    // -- > Prepare the buffer for click sounds.
    click_request.open('GET', 'sounds/click.wav', true);
    click_request.responseType = 'arraybuffer';
    click_request.onload = function () {
        context.decodeAudioData(click_request.response, function (buffer) {
            click_sound_buffer = buffer;
        });
    };
    click_request.send();
    // < --

    function beep(duration) {
        gainNode.connect(context.destination);
        setTimeout(function () {gainNode.disconnect(context.destination); }, duration);
    }

    return {
        play_countdown: function () {
            beep(250);
        },
        play_time_expired: function () {
            beep(1000);
        },
        play_click: function () {
            var click_buffer_source = context.createBufferSource();
            // Don't play the sound before its buffer has been
            // initialized.
            if (click_sound_buffer === undefined) {
                return;
            }
            click_buffer_source.buffer = click_sound_buffer;
            click_buffer_source.connect(context.destination);
            click_buffer_source.start();
        }
    };
});
