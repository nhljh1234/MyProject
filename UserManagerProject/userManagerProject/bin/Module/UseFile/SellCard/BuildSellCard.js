var outModule = {};
var local = {};
var FileSaveTool = require('../../../FileSaveTool/FileSaveTool');
var GlobalData = require('../../../GlobalData');

outModule.buildSellCard = (req, res) => {
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
        userType !== GlobalData.USER_TYPE_DELIVERY_PERSON) {
        res.send(JSON.stringify({
            ret: -1,
            errorStr: '没有权限'
        }));
        res.end();
        return;
    }
    let data = req.body;
    FileSaveTool.getJsonData(GlobalData.SELLGOOD_SAVE_JSON_FILE_NAME, function() {
        let sellGoodJsonData = FileSaveTool.getLocalSaveData(GlobalData.SELLGOOD_SAVE_JSON_FILE_NAME);
        if (sellGoodJsonData[data.deviceId]) {
            res.send(JSON.stringify({
                ret: -1,
                errorStr: '该订单已存在'
            }));
            res.end();
            return;
        }
        FileSaveTool.changeJsonData(GlobalData.SELLGOOD_SAVE_JSON_FILE_NAME, data.deviceId,
            FileSaveTool.buildSellGoodData(
                data.deviceId,
                data.num,
                data.customerName,
                data.customerPos,
                data.customerPhone,
                data.customerArea,
                data.canRead === undefined ? 1 : data.canRead,
                data.finish
            ), true);
        res.send(JSON.stringify({
            ret: 1,
            successStr: '创建订单成功'
        }));
        res.end();
    });
};

module.exports = outModule;