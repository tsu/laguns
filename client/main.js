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

function init() {
  program
    .map(block)
    .reduce(append, $('<div>', { 'class': 'content' }))
    .appendTo($('body'));
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
        } else if (value >= 0) {
          $circle.removeClass('circle-white circle-green').addClass('circle-red').text(reps);
        } else {
          $circle.removeClass('circle-red circle-green').addClass('circle-white').text(reps);
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