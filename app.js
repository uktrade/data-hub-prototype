'use strict';

const express = require('express');
const app = express();
const port = (process.env.PORT || 8080);

app.use( express.static(__dirname + '/build') );
app.use( express.static(__dirname + '/public') );
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('*', function(req, res) {
  res.render('index');
});

app.listen(port);
