const express = require('express');
const nunjucks = require('nunjucks');
const logger = require('morgan');

const admin = require('./route/admin4');
const contacts = require('./route/contacts');

const app = express();
const port = 3000;

nunjucks.configure('template',{
    autoescape:true,
    express:app
});

app.use('/static',express.static('uploads'));
app.use(function(req,res,next){
    //Global View Variable 선언 - 이걸해주지 않으면 매번 응답할 때 로그인상태값을 전달해줘야 한다.
    //코드의 낭비...
    app.locals.isLogin = true;
    next();
});
app.use(logger('dev'));
app.use('/admin', vipMidlleware, admin); 
app.use('/contacts',contacts);

//오류처리
app.use(function(req, res, _){
    res.status(404).render('common/404.html');
});
app.use(function(req, res, _){
    res.status(500).render('common/500.html');
});

function vipMidlleware(req,res,next){
    console.log('최우선 미들웨어');
    next();
}

app.get('/', function(req,res){
    res.send('Index Page.....');
});

app.listen(port,function(){
    console.log(`Express listening on port ${port}`);
});