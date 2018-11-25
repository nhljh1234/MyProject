var outModule = {};
var local = {};
var FileSaveTool = require('../../../FileSaveTool/FileSaveTool');
var GlobalData = require('../../../GlobalData');

outModule.buildUser = (req, res) => {
    //判断session
    if (!req.session || !req.session.userData) {
        res.send(JSON.stringify({
            ret: -2,
            errorStr: '请登录'
        }));
        res.end();
        return;
    }
    //判断创建权限
    let userName = req.session.userData.userName;
    let password = req.session.userData.password;
    let userType = req.session.userData.type;
    let buildName = req.body.userName;
    let buildPassword = req.body.password;
    let buildType = req.body.type;
    let buildUserPos = req.body.userPos;
    if (userType !== GlobalData.USER_TYPE_SUPER) {
        res.send(JSON.stringify({
            ret: -1,
            errorStr: '没有权限'
        }));
        res.end();
        return;
    }
    FileSaveTool.getJsonData(GlobalData.USER_SAVE_JSON_FILE_NAME, function() {
        let userJsonData = FileSaveTool.getLocalSaveData(GlobalData.USER_SAVE_JSON_FILE_NAME);
        if (!userJsonData || !userJsonData[userName] || userJsonData[userName].password !== password) {
            res.send(JSON.stringify({
                ret: -2,
                errorStr: '请登录'
            }));
            res.end();
            return;
        }
        if (userJsonData[userName].type !== GlobalData.USER_TYPE_SUPER) {
            res.send(JSON.stringify({
                ret: -2,
                errorStr: '没有权限'
            }));
            res.end();
            return;
        }
        if (userJsonData[buildName]) {
            res.send(JSON.stringify({
                ret: -1,
                errorStr: '该用户名已存在'
            }));
            res.end();
            return;
        }
        //删除数据
        FileSaveTool.changeJsonData('user', buildName,
            FileSaveTool.buildUserData(
                buildName,
                buildPassword,
                buildType,
                buildUserPos
            ), true);
        res.send(JSON.stringify({
            ret: 1,
            successStr: '新建账号成功'
        }));
        res.end();
    }, undefined);
};

module.exports = outModule;