var outModule = {};
var local = {};
var FileSaveTool = require('../../../FileSaveTool/FileSaveTool');
var GlobalData = require('../../../GlobalData');

outModule.checkUser = (req, res) => {
    //判断session
    let userName = req.body.userName;
    let password = req.body.password;
    if (req.session && req.session.userData && req.session.userData.userName === userName && req.session.userData.password === password) {
        res.send(JSON.stringify({
            ret: 1,
            userType: req.session.userData.type
        }));
        res.end();
        return;
    }
    if (!req.body) {
        res.send(JSON.stringify({
            ret: -1,
            errorStr: '服务端解析错误'
        }));
        res.end();
        return;
    }
    FileSaveTool.getJsonData(GlobalData.USER_SAVE_JSON_FILE_NAME, function() {
        let userJsonData = FileSaveTool.getLocalSaveData(GlobalData.USER_SAVE_JSON_FILE_NAME);
        if (!userJsonData || !userJsonData[userName] || userJsonData[userName].password !== password) {
            res.send(JSON.stringify({
                ret: -1,
                errorStr: '用户名或者密码错误'
            }));
            res.end();
            return;
        }
        //session
        req.session.userData = userJsonData[userName];
        res.send(JSON.stringify({
            ret: 1,
            userType: userJsonData[userName].type
        }));
        res.end();
    }, undefined);
};

module.exports = outModule;