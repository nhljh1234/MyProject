var outModule = {};
var local = {};
var fs = require('fs'); //文件模块

local.fileSave = {};

/**
 * 新建一个用户的存储数据
 * @param userName
 * @param userPassword
 * @param userType
 * @param userPos 用户归属地
 */
outModule.buildUserData = (userName, userPassword, userType, userPos) => {
    return {
        userName: userName,
        password: userPassword,
        type: parseInt(userType),
        userPos: userPos
    }
};

/**
 * 新建一个设备的存储数据
 * @param deviceId
 * @param customerName
 * @param customerPos
 * @param customerPhone
 * @param customerArea 设备归属地，对应用户归属地，普通用户只能查对应归属地的设备
 */
outModule.buildDeviceData = (deviceId, customerName, customerPos, customerPhone, customerArea) => {
    return {
        deviceId: deviceId,
        customerName: customerName,
        customerPos: customerPos,
        customerPhone: customerPhone,
        customerArea: customerArea
    }
};

/**
 * 新建一个订单的存储数据
 * @param deviceId
 * @param num 快递单号
 * @param customerName
 * @param customerPos
 * @param customerPhone
 * @param customerArea 
 * @param canRead 发货员是否可见
 * @param finish 是否完成
 */
outModule.buildSellGoodData = (deviceId, num, customerName, customerPos, customerPhone, customerArea, canRead, finish) => {
    return {
        deviceId: deviceId,
        num: num,
        customerName: customerName,
        customerPos: customerPos,
        customerPhone: customerPhone,
        customerArea: customerArea,
        canRead: parseInt(canRead),
        finish: parseInt(finish)
    }
};

/**
 * 获取本地缓存的文件
 */
outModule.getLocalSaveData = (jsonFileName) => {
    return local.fileSave[jsonFileName] || {};
};

/**
 * 改变数据
 * @param saveFlag 是否保存变化
 */
outModule.changeJsonData = (jsonFileName, key, value, saveFlag = true) => {
    if (local.fileSave[jsonFileName]) {
        local.fileSave[jsonFileName][key] = value;
        if (value === undefined) {
            delete local.fileSave[jsonFileName][key];
        }
        if (saveFlag) {
            outModule.saveJsonData(jsonFileName, local.fileSave[jsonFileName], undefined, undefined);
        }
    }
};

outModule.init = () => {
    //outModule.getJsonData('user', undefined, undefined);
};

/**
 * @param jsonFileName 文件名
 * @param successCb 操作回调
 * @param failCb 失败的回调
 */
outModule.getJsonData = (jsonFileName, successCb, failCb) => {
    if (local.fileSave[jsonFileName]) {
        if (successCb) {
            successCb();
        }
        return;
    }
    fs.readFile('./bin/JsonFile/' + jsonFileName + '.json', 'utf8', function(err, data) {
        if (err) {
            console.log(`readFile error ! error is ${err}`);
            if (failCb) {
                failCb();
            }
            return;
        }
        try {
            local.fileSave[jsonFileName] = data.length === 0 ? {} : JSON.parse(data);
            if (successCb) {
                successCb();
            }
        } catch (e) {
            console.log(`parse error ! error is ${e}`);
        }
    });
};

/**
 * 写入一个数据
 */
outModule.saveJsonData = (jsonFileName, data, successCb, failCb) => {
    try {
        data = JSON.stringify(data);
        fs.writeFile('./bin/JsonFile/' + jsonFileName + '.json', data, 'utf8', function(err) {
            if (err) {
                console.log(`writeFile error ! error is ${err}`);
                if (failCb) {
                    failCb(err);
                }
                return;
            }
            if (successCb) {
                successCb();
            }
        });
    } catch (e) {
        console.log(`stringify error ! error is ${e}`);
    }
};

module.exports = outModule;