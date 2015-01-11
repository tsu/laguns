require('normalize-css');
var $ = require('jquery');
var Bacon = require('baconjs').Bacon;
$.fn.asEventStream = Bacon.$.asEventStream;

$(document).ready(init);

var program = [
  {'name': 'Reverse', reps: 8},
  {'name': 'Incline', reps: 8},
  {'name': 'Single', reps: 8},
  {'name': 'Curl', reps: 8},
  {'name': 'Triceps', reps: 8},
  {'name': 'Shrugs', reps: 8},
  {'name': 'Calf', reps: 12}
];

var oneAndAHalfMinuteInSeconds = 90;
var fiveMinutesInSeconds = 5 * 60;
var fiveSecondsInMillis = 5 * 1000;
var timerStream = new Bacon.Bus();

function init() {
  $('body')
    .append(timer())
    .append(content());
}

function timer() {
  var $timer = $('<div>', { 'class': 'timer' });
  var counter = timerStream
    .flatMapLatest(toCountdown);

  counter
    .map(formatCounter)
    .doAction(setTextOf($timer))
    .onValue(slideDown($timer));

  counter
    .filter(isZero)
    .flatMapLatest(delay)
    .onValue(slideUp($timer));

  return $timer;
}

function delay() {
  return Bacon.later(fiveSecondsInMillis, 1);
}

function formatCounter(value) {
  return value > 0 ? formatTime(value) : 'BODI ON';
}

function formatTime(value) {
  var minutes = Math.floor(value / 60);
  var seconds = value % 60;
  return minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
}

function isZero(x) {
  return x == 0;
}
function slideDown($element) {
  return function() {
    $element.slideDown();
  };
}

function slideUp($element) {
  return function() {
    $element.slideUp();
  };
}

function toCountdown(seconds) {
  return Bacon
    .interval(1000, 1)
    .scan(seconds, substract)
    .takeWhile(greaterOrEqualToZero);
}

function substract(x, y) {
  return x - y;
}

function greaterOrEqualToZero(x) {
  return x >= 0;
}

function setTextOf($element) {
  return function(text) {
    $element.text(text);
  };
}

function content() {
  return program
    .map(block)
    .reduce(append, $('<div>', { 'class': 'content' }));
}

function block(excercise) {
  return $('<h2>')
    .text(excercise.name)
    .add(circles(excercise.reps));
}

function circles(reps) {
  return [1, 2, 3, 4].map(circle(reps)).reduce(append, $('<ol>', { 'class': 'circles' }));
}

function circle(reps) {
  return function() {
    var $circle = $('<li>', { 'class': 'circle circle-white' }).text('-1');
    $circle
      .asEventStream('click')
      .map(1)
      .scan(-1, substractWithWrapAround(reps))
      .onValue(function(value) {
        if (value == reps) {
          $circle.removeClass('circle-white circle-red').addClass('circle-green').text(reps);
          countdownAfterSuccess();
        } else if (value >= 0) {
          $circle.removeClass('circle-white circle-green').addClass('circle-red').text(reps);
          countdownAfterFailure();
        } else {
          $circle.removeClass('circle-red circle-green').addClass('circle-white').text(reps);
          clearCountdown();
        }
        $circle.text(value);
    });
    return $circle;
  };
}

function append($parent, $child) {
  return $parent.append($child);
}

function substractWithWrapAround(reps) {
  return function (x, y) {
    var sum = x - y;
    return sum < -1 ? reps : sum;
  };
}

function countdownAfterSuccess() {
  countdown(oneAndAHalfMinuteInSeconds);
}

function countdownAfterFailure() {
  countdown(fiveMinutesInSeconds);
}

function clearCountdown() {
  countdown(0);
}

function countdown(seconds) {
  timerStream.push(seconds);
}