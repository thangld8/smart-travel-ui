var express = require('express');
const path = require('path');
var app = express();
// app.use(express.static(__dirname + '/src/index.html'));
app.use(express.static(path.resolve(__dirname, 'dist')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
app.listen(process.env.PORT || 8080);