var outModule = {};
var local = {};
var MysqlTool = require('../../../MysqlTool/MysqlTool');
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
    let connection = MysqlTool.getMysqlObjByDBName('test');
    connection.query(`DELETE FROM sell_card WHERE deviceId='${deleteDeviceId}'`, function(err, rows, field) {
        if (err) {
            console.log(`DELETE FROM sell_card WHERE deviceId='${deleteDeviceId}'`);
            console.log(err);
            res.send(JSON.stringify({
                ret: -1,
                errorStr: '数据库错误'
            }));
            res.end();
        } else {
            res.send(JSON.stringify({
                ret: 1,
                successStr: '删除成功'
            }));
            res.end();
        }
    });
};

module.exports = outModule;