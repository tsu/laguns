var Bacon = require('baconjs');
var $ = require('jquery');

$(document).ready(init);

function init() {
  var $body = $('body');
  $body
    .append(title())
    .append(circle());
}

function title() {
  return $('<h1>').text("LAGUNS");
}

function circle() {
  var $circle = $('<div>', { 'class': 'circle circle-white' });
  $circle.on('click', function() {
    $circle.removeClass('circle-white').addClass('circle-green')
  });
  return $circle;
}
