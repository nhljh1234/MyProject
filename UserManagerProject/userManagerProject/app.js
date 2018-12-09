var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var FileStore = require('session-file-store')(session);
var path = require('path');
var FileSaveTool = require('./bin/FileSaveTool/FileSaveTool');

FileSaveTool.init();

var GetDeviceMsg;
var BuildDevice;
var DeleteDevice;
var ChangeDevice;

var GetUserMsg;
var ChectUser;
var BuildUser;
var DeleteUser;

var BuildSellCard;
var GetSellCardMsg;
var ChangeSellCard;
var DeleteSellCard;

const USE_MYSQL_SAVE = 1;
const USE_FILE_SAVE = 2;
let USE_TYPE = USE_FILE_SAVE;

//这边做一下区分
if (USE_TYPE === USE_FILE_SAVE) {
    GetDeviceMsg = require('./bin/Module/UseFile/Device/GetDeviceMsg');
    BuildDevice = require('./bin/Module/UseFile/Device/BuildDevice');
    DeleteDevice = require('./bin/Module/UseFile/Device/DeleteDevice');
    ChangeDevice = require('./bin/Module/UseFile/Device/ChangeDevice');

    GetUserMsg = require('./bin/Module/UseFile/User/GetUserMsg');
    ChectUser = require('./bin/Module/UseFile/User/CheckUser');
    BuildUser = require('./bin/Module/UseFile/User/BuildUser');
    DeleteUser = require('./bin/Module/UseFile/User/DeleteUser');

    BuildSellCard = require('./bin/Module/UseFile/SellCard/BuildSellCard');
    GetSellCardMsg = require('./bin/Module/UseFile/SellCard/GetSellCardMsg');
    ChangeSellCard = require('./bin/Module/UseFile/SellCard/ChangeSellCard');
    DeleteSellCard = require('./bin/Module/UseFile/SellCard/DeleteSellCard');
} else {

}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({
    name: 'session',
    secret: 'secret', // 用来对session id相关的cookie进行签名
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

//app.listen(8888);
app.listen(3389);