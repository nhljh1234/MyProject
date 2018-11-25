var outModule = {};
var local = {};
var FileSaveTool = require('../../../FileSaveTool/FileSaveTool');
var GlobalData = require('../../../GlobalData');

outModule.deleteSellCard = (req, res) => {
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
    //可以删除
    let deleteDeviceId = req.body.deleteDeviceId;
    FileSaveTool.getJsonData(GlobalData.SELLGOOD_SAVE_JSON_FILE_NAME, function() {
        FileSaveTool.changeJsonData(GlobalData.SELLGOOD_SAVE_JSON_FILE_NAME, deleteDeviceId, undefined, true);
        res.send(JSON.stringify({
            ret: 1,
            successStr: '删除订单成功'
        }));
        res.end();
        return;
    });
};

module.exports = outModule;