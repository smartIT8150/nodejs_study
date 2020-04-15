'use strict';

const express = require('express');
const app = express();
const port = 3000;

app.get('/',function(req,res){
    res.send('Hello Express!');
});

app.listen(port, function(){
    console.log(`Express app listening on port ${port}`);
});