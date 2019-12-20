var express = require('express');
var path = require('path');
var app = express();
app.use(express.static(path.join(__dirname, 'view')));
app.use(express.static(__dirname));
app.listen(8000, '0.0.0.0', function() { console.log('Application is running on http://localhost:8000')});
module.exports = app;