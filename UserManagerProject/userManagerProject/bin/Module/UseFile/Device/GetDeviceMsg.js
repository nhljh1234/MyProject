var outModule = {};
var local = {};
var FileSaveTool = require('../../../FileSaveTool/FileSaveTool');
var GlobalData = require('../../../GlobalData');

outModule.getDeviceMsg = (req, res) => {
    //判断session
    if (!req.session || !req.session.userData) {
        res.send(JSON.stringify({
            ret: -2,
            errorStr: '请登录'
        }));
        res.end();
        return;
    }
    let userType = req.session.userData.type;
    if (userType !== GlobalData.USER_TYPE_SUPER && userType !== GlobalData.USER_TYPE_CUSTOMER_MANAGER &&
        userType !== GlobalData.USER_TYPE_BUILDER && userType !== GlobalData.USER_TYPE_CUSTOMER) {
        res.send(JSON.stringify({
            ret: -1,
            errorStr: '没有权限'
        }));
        res.end();
        return;
    }
    FileSaveTool.getJsonData(GlobalData.DEVICE_SAVE_JSON_FILE_NAME, function() {
        let deviceData = FileSaveTool.getLocalSaveData(GlobalData.DEVICE_SAVE_JSON_FILE_NAME);
        let allDeviceArr = [];
        //特殊处理
        if (userType === GlobalData.USER_TYPE_CUSTOMER) {
            FileSaveTool.getJsonData(GlobalData.USER_SAVE_JSON_FILE_NAME, function() {
                let userJosnData = FileSaveTool.getLocalSaveData(GlobalData.USER_SAVE_JSON_FILE_NAME);
                if (!userJosnData[req.session.userData.userName]) {
                    res.send(JSON.stringify({
                        ret: -2,
                        errorStr: '请登录'
                    }));
                    res.end();
                    return;
                }
                let userArea = userJosnData[req.session.userData.userName].userPos;
                console.log(userArea);
                for (var key in deviceData) {
                    if (!deviceData.hasOwnProperty(key)) {
                        continue;
                    }
                    console.log(deviceData[key].customerArea);
                    if (deviceData[key].customerArea !== userArea) {
                        continue;
                    }
                    let showData = {};
                    showData.deviceId = deviceData[key].deviceId;
                    allDeviceArr.push(showData);
                }
                res.send(JSON.stringify({
                    ret: 1,
                    dataArr: allDeviceArr
                }));
                res.end();
            });
            return;
        }
        for (var key in deviceData) {
            if (!deviceData.hasOwnProperty(key)) {
                continue;
            }
            //根据权限删除一些数据
            let showData = {};
            showData.deviceId = deviceData[key].deviceId;
            showData.customerArea = deviceData[key].customerArea;
            showData.customerPos = deviceData[key].customerPos;
            if (userType === GlobalData.USER_TYPE_SUPER) {
                showData.customerName = deviceData[key].customerName;
                showData.customerPhone = deviceData[key].customerPhone;
            }
            if (userType === GlobalData.USER_TYPE_SUPER || userType === GlobalData.USER_TYPE_CUSTOMER_MANAGER) {
                showData.customerArea = deviceData[key].customerArea;
                showData.customerPos = deviceData[key].customerPos;
            }
            allDeviceArr.push(showData);
        }
        res.send(JSON.stringify({
            ret: 1,
            dataArr: allDeviceArr
        }));
        res.end();
    }, undefined);
};

module.exports = outModule;