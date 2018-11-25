var outModule = {};
var local = {};
var FileSaveTool = require('../../../FileSaveTool/FileSaveTool');
var GlobalData = require('../../../GlobalData');

outModule.deleteDevice = (req, res) => {
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
    let deleteDeviceId = req.body.deleteDeviceId;
    if (userType !== GlobalData.USER_TYPE_SUPER && userType !== GlobalData.USER_TYPE_CUSTOMER_MANAGER) {
        res.send(JSON.stringify({
            ret: -1,
            errorStr: '没有权限'
        }));
        res.end();
        return;
    }
    FileSaveTool.getJsonData(GlobalData.DEVICE_SAVE_JSON_FILE_NAME, function() {
        FileSaveTool.changeJsonData(GlobalData.DEVICE_SAVE_JSON_FILE_NAME, deleteDeviceId, undefined, true);
        res.send(JSON.stringify({
            ret: 1,
            successStr: '删除设备成功'
        }));
        res.end();
        return;
    });
};

module.exports = outModule;