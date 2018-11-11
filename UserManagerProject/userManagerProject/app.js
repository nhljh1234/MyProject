var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var FileStore = require('session-file-store')(session);
var path = require('path');

var GetDeviceMsg = require('./bin/Module/GetMsg/GetDeviceMsg');
var ChectUser = require('./bin/Module/CheckUser/CheckUser');
var BuildUser = require('./bin/BuildUser/BuildUser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
    name: 'skey',
    secret: 'secret', // 用来对session id相关的cookie进行签名
    store: new FileStore(), // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
    resave: false, // 是否每次都重新保存会话，建议false
    rolling: true,
    cookie: {
        //maxAge: 60 * 60 * 1000 // 有效期，单位是毫秒
        maxAge: 60 * 60 * 1000
    }
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});

app.post('/checkUser', (req, res) => {
    ChectUser.checkUser(req, res);
});

app.post('/getDeviceMsg', (req, res) => {
    GetDeviceMsg.getDeviceMsg(req, res);
});

app.post('/buildUser', (req, res) => {
    GetDeviceMsg.getDeviceMsg(req, res);
});

app.use('/data', express.static(path.join(__dirname, 'public')));

app.listen(8888);