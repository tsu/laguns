var Bacon = require('baconjs');
var $ = require('jquery');
require('normalize-css');

$(document).ready(init);

function init() {
  ['Reverse', 'Incline', 'Single', 'Curl', 'Triceps', 'Shrugs', 'Calf']
    .map(block)
    .reduce(append, $('<div>', { 'class': 'content' }))
    .appendTo($('body'));
}

function block(title) {
  return $('<h2>').text(title).add(circles());
}

function circles() {
  return [1, 2, 3, 4].map(circle).reduce(append, $('<ol>', { 'class': 'circles' }));
}

function circle() {
  var $circle = $('<li>', { 'class': 'circle circle-white' });
  $circle.on('click', function() {
    $circle.removeClass('circle-white').addClass('circle-green');
  });
  return $circle;
}

function append($parent, $child) {
  return $parent.append($child);
}