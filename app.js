var express = require('express');
var app = express();

app.use(express.static('project'));

app.listen(3000, function() {
    console.log('Project is running on localhost:3000');
});