var outModule = {};
var local = {};
var MysqlTool = require('../../MysqlTool/MysqlTool');

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
    let data = req.body;
    let connection = MysqlTool.getMysqlObjByDBName('test');
    connection.query(`SELECT * FROM sell_card WHERE deviceId=${data.deviceId}`, function(err, rows, field) {
        if (err) {
            console.log(`SELECT * FROM sell_card WHERE deviceId=${data.deviceId}`);
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
            if (req.session.userData.type === 1) {
                mysqlStr = `UPDATE sell_card SET num='${data.num}', user_name='${data.userName}', user_pos=${data.userPos}, 
                can_read=${data.canRead}, finish=${data.finish} WHERE deviceId=${data.deviceId}`;
            } else if (req.session.userData.type === 2) {
                mysqlStr = `UPDATE sell_card SET num='${data.num}', can_read=${data.canRead}, finish=${data.finish} WHERE deviceId=${data.deviceId}`;
            } else if (req.session.userData.type === 3) {
                mysqlStr = `UPDATE sell_card SET num='${data.num}', finish=${data.finish} WHERE deviceId=${data.deviceId}`;
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