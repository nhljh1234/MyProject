var outModule = {};
var local = {};
var FileSaveTool = require('../../../FileSaveTool/FileSaveTool');
var GlobalData = require('../../../GlobalData');

outModule.buildDevice = (req, res) => {
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
    let userType = req.session.userData.type;
    if (userType !== GlobalData.USER_TYPE_SUPER && userType !== GlobalData.USER_TYPE_CUSTOMER_MANAGER) {
        res.send(JSON.stringify({
            ret: -1,
            errorStr: '没有权限'
        }));
        res.end();
        return;
    }
    let data = req.body;
    FileSaveTool.getJsonData(GlobalData.DEVICE_SAVE_JSON_FILE_NAME, function() {
        let deviceData = FileSaveTool.getLocalSaveData(GlobalData.DEVICE_SAVE_JSON_FILE_NAME);
        if (deviceData[data.deviceId]) {
            res.send(JSON.stringify({
                ret: -1,
                errorStr: '已存在该设备'
            }));
            res.end();
            return;
        }
        FileSaveTool.changeJsonData(GlobalData.DEVICE_SAVE_JSON_FILE_NAME, data.deviceId,
            FileSaveTool.buildDeviceData(
                data.deviceId,
                data.customerName,
                data.customerPos,
                data.customerPhone,
                data.customerArea
            ), true);
        res.send(JSON.stringify({
            ret: 1,
            successStr: '增加设备成功'
        }));
        res.end();
    }, undefined);
};

module.exports = outModule;