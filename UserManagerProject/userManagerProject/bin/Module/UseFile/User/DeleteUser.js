var outModule = {};
var local = {};
var FileSaveTool = require('../../../FileSaveTool/FileSaveTool');
var GlobalData = require('../../../GlobalData');

outModule.deleteUser = (req, res) => {
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
    let deleteName = req.body.deleteName;
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
        if (userJsonData[deleteName] && userJsonData[deleteName].type === GlobalData.USER_TYPE_SUPER) {
            res.send(JSON.stringify({
                ret: -1,
                errorStr: '无法删除超级管理员'
            }));
            res.end();
            return;
        }
        //删除数据
        FileSaveTool.changeJsonData('user', deleteName, undefined, true);
        res.send(JSON.stringify({
            ret: 1,
            successStr: '删除成功'
        }));
        res.end();
    }, undefined);
};

module.exports = outModule;