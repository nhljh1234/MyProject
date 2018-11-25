var outModule = {};
var local = {};
var MysqlTool = require('../../../MysqlTool/MysqlTool');
var GlobalData = require('../../../GlobalData');

outModule.changeSellCard = (req, res) => {
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
    let connection = MysqlTool.getMysqlObjByDBName('test');
    connection.query(`SELECT * FROM sell_card WHERE deviceId='${data.deviceId}'`, function(err, rows, field) {
        if (err) {
            console.log(`SELECT * FROM sell_card WHERE deviceId='${data.deviceId}'`);
            console.log(err);
            res.send(JSON.stringify({
                ret: -1,
                errorStr: '数据库错误'
            }));
            res.end();
        } else if (rows.length === 0) {
            res.send(JSON.stringify({
                ret: -1,
                errorStr: '设备id错误'
            }));
            res.end();
        } else {
            let connection = MysqlTool.getMysqlObjByDBName('test');
            let mysqlStr;
            if (req.session.userData.type === GlobalData.USER_TYPE_SUPER) {
                mysqlStr = `UPDATE sell_card SET num='${data.num}', user_name='${data.userName}', user_pos=${data.userPos}, 
                can_read=${data.canRead}, finish=${data.finish} WHERE deviceId='${data.deviceId}'`;
            } else if (req.session.userData.type === GlobalData.USER_TYPE_CUSTOMER_MANAGER) {
                mysqlStr = `UPDATE sell_card SET num='${data.num}', can_read=${data.canRead}, finish=${data.finish} WHERE deviceId='${data.deviceId}'`;
            } else if (req.session.userData.type === GlobalData.USER_TYPE_DELIVERY_PERSON) {
                mysqlStr = `UPDATE sell_card SET num='${data.num}', finish=${data.finish} WHERE deviceId='${data.deviceId}'`;
            }
            connection.query(mysqlStr, function(err, rows, field) {
                if (err) {
                    console.log(mysqlStr);
                    console.log(err);
                    res.send(JSON.stringify({
                        ret: -1,
                        errorStr: '数据库错误'
                    }));
                    res.end();
                } else {
                    res.send(JSON.stringify({
                        ret: 1,
                        successStr: '修改订单信息成功'
                    }));
                    res.end();
                }
            });
        }
    });
};

module.exports = outModule;