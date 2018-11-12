var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var FileStore = require('session-file-store')(session);
var path = require('path');

var GetDeviceMsg = require('./bin/Module/Device/GetDeviceMsg');
var BuildDevice = require('./bin/Module/Device/BuildDevice');
var DeleteDevice = require('./bin/Module/Device/DeleteDevice');
var ChangeDevice = require('./bin/Module/Device/ChangeDevice');

var GetUserMsg = require('./bin/Module/User/GetUserMsg');
var ChectUser = require('./bin/Module/User/CheckUser');
var BuildUser = require('./bin/Module/User/BuildUser');
var DeleteUser = require('./bin/Module/User/DeleteUser');

var BuildSellCard = require('./bin/Module/SellCard/BuildSellCard');
var GetSellCardMsg = require('./bin/Module/SellCard/GetSellCardMsg');
var ChangeSellCard = require('./bin/Module/SellCard/ChangeSellCard');
var DeleteSellCard = require('./bin/Module/SellCard/DeleteSellCard');

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

app.post('/getDeviceMsg', (req, res) => {
    GetDeviceMsg.getDeviceMsg(req, res);
});
app.post('/buildDevice', (req, res) => {
    BuildDevice.buildDevice(req, res);
});
app.post('/deleteDevice', (req, res) => {
    DeleteDevice.deleteDevice(req, res);
});
app.post('/changeDevice', (req, res) => {
    ChangeDevice.changeDevice(req, res);
});


app.post('/checkUser', (req, res) => {
    ChectUser.checkUser(req, res);
});
app.post('/getUserMsg', (req, res) => {
    GetUserMsg.getUserMsg(req, res);
});
app.post('/buildUser', (req, res) => {
    BuildUser.buildUser(req, res);
});
app.post('/deleteUser', (req, res) => {
    DeleteUser.deleteUser(req, res);
});

app.post('/buildSellCard', (req, res) => {
    BuildSellCard.buildSellCard(req, res);
});
app.post('/getSellCardMsg', (req, res) => {
    GetSellCardMsg.getSellCardMsg(req, res);
});
app.post('/changeSellCard', (req, res) => {
    ChangeSellCard.changeSellCard(req, res);
});
app.post('/DeleteSellCard', (req, res) => {
    DeleteSellCard.deleteSellCard(req, res);
});

app.use('/data', express.static(path.join(__dirname, 'public')));

app.listen(3389);