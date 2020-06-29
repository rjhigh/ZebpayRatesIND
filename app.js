var express = require('express');
var app = express();
const port = process.env.PORT || 3000;

app.use('/',express.static('project'));

app.listen(port, function() {
    console.log('Project is running on localhost:3000');
});