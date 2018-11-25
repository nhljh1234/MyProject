var outModule = {};
var local = {};
var MysqlTool = require('../../../MysqlTool/MysqlTool');
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
    let connection = MysqlTool.getMysqlObjByDBName('test');
    connection.query(`SELECT * FROM device WHERE deviceId='${data.deviceId}'`, function(err, rows, field) {
        if (err) {
            console.log(`SELECT * FROM device WHERE deviceId='${data.deviceId}'`);
            console.log(err);
            res.send(JSON.stringify({
                ret: -1,
                errorStr: '数据库错误'
            }));
            res.end();
        } else if (rows.length === 0) {
            res.send(JSON.stringify({
                ret: -1,
                errorStr: '没有这台设备'
            }));
            res.end();
        } else {
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
                } else if (rows.length !== 0) {
                    res.send(JSON.stringify({
                        ret: -1,
                        errorStr: '这台设备已存在订单信息'
                    }));
                    res.end();
                } else {
                    let connection = MysqlTool.getMysqlObjByDBName('test');
                    connection.query(`INSERT INTO sell_card (deviceId, num, user_name, user_pos, can_read, finish) VALUES ('${data.deviceId}', '${data.num}', '${data.userName || "未输入"}', '${data.userPos || "未输入"}', ${data.canRead || 0}, ${data.finish})`, function(err, rows, field) {
                        if (err) {
                            console.log(`INSERT INTO sell_card (deviceId, num, user_name, user_pos, can_read, finish) VALUES ('${data.deviceId}', '${data.num}', '${data.userName || "未输入"}', '${data.userPos || "未输入"}', ${data.canRead || 0}, ${data.finish})`);
                            console.log(err);
                            res.send(JSON.stringify({
                                ret: -1,
                                errorStr: '数据库错误'
                            }));
                            res.end();
                        } else {
                            res.send(JSON.stringify({
                                ret: 1,
                                successStr: '增加订单成功'
                            }));
                            res.end();
                        }
                    });
                }
            });
        }
    });
};

module.exports = outModule;