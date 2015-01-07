var browserify = require('browserify-middleware');
var lessify = require('less-middleware');
var express = require('express');
var app = express();
var publicDir = __dirname + '/public';

app.set('port', (process.env.PORT || 5000));
app.use(lessify(publicDir));
app.use(express.static(publicDir));
app.use('/js/bundle.js', browserify('./client/main.js'));
app.listen(app.get('port'), function() {
  console.log("Server is running at localhost:" + app.get('port'));
});
