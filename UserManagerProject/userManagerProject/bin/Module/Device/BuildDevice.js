var outModule = {};
var local = {};
var MysqlTool = require('../../MysqlTool/MysqlTool');

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
    if (userType !== 1 && userType !== 2) {
        res.send(JSON.stringify({
            ret: -1,
            errorStr: '没有权限'
        }));
        res.end();
        return;
    }
    let data = req.body;
    let connection = MysqlTool.getMysqlObjByDBName('test');
    connection.query(`SELECT * FROM device WHERE deviceId=${data.deviceId}`, function(err, rows, field) {
        if (err) {
            console.log(`build device`);
            console.log(err);
            res.send(JSON.stringify({
                ret: -1,
                errorStr: '数据库错误'
            }));
            res.end();
        } else if (rows.length > 0) {
            res.send(JSON.stringify({
                ret: -1,
                errorStr: '已存在该设备'
            }));
            res.end();
        } else {
            let connection = MysqlTool.getMysqlObjByDBName('test');
            connection.query(`INSERT INTO device (deviceId, user_name, user_pos) VALUES (${data.deviceId}, '${data.user_name || "未输入"}', '${data.user_pos || "未输入"}')`, function(err, rows, field) {
                if (err) {
                    console.log(`build device`);
                    console.log(err);
                    res.send(JSON.stringify({
                        ret: -1,
                        errorStr: '数据库错误'
                    }));
                    res.end();
                } else {
                    res.send(JSON.stringify({
                        ret: 1,
                        successStr: '增加设备成功'
                    }));
                    res.end();
                }
            });
        }
    });
};

module.exports = outModule;