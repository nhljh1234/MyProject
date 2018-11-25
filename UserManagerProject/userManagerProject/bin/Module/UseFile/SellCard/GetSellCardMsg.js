var outModule = {};
var local = {};
var FileSaveTool = require('../../../FileSaveTool/FileSaveTool');
var GlobalData = require('../../../GlobalData');

outModule.getSellCardMsg = (req, res) => {
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
    FileSaveTool.getJsonData(GlobalData.SELLGOOD_SAVE_JSON_FILE_NAME, function() {
        let sellGoodData = FileSaveTool.getLocalSaveData(GlobalData.SELLGOOD_SAVE_JSON_FILE_NAME);
        let allSellGoodArr = [];
        for (var key in sellGoodData) {
            if (!sellGoodData.hasOwnProperty(key)) {
                continue;
            }
            if (userType === GlobalData.USER_TYPE_DELIVERY_PERSON && !sellGoodData[key].canRead) {
                continue;
            }
            //根据权限删除一些数据
            let showData = {};
            showData.deviceId = sellGoodData[key].deviceId;
            showData.customerArea = sellGoodData[key].customerArea;
            showData.customerPos = sellGoodData[key].customerPos;
            showData.num = sellGoodData[key].num;
            showData.canRead = sellGoodData[key].canRead;
            showData.finish = sellGoodData[key].finish;
            if (userType === GlobalData.USER_TYPE_SUPER) {
                showData.customerName = sellGoodData[key].customerName;
                showData.customerPhone = sellGoodData[key].customerPhone;
            }
            allSellGoodArr.push(showData);
        }
        res.send(JSON.stringify({
            ret: 1,
            dataArr: allSellGoodArr
        }));
        res.end();
    });
};

module.exports = outModule;