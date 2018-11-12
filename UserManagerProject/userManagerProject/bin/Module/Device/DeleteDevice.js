var outModule = {};
var local = {};
var MysqlTool = require('../../MysqlTool/MysqlTool');

outModule.deleteDevice = (req, res) => {
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
    let userName = req.session.userData.userName;
    let password = req.session.userData.password;
    let userType = req.session.userData.type;
    let deleteDeviceId = req.body.deleteDeviceId;
    if (userType !== 1 && userType !== 2) {
        res.send(JSON.stringify({
            ret: -1,
            errorStr: '没有权限'
        }));
        res.end();
        return;
    }
    let connection = MysqlTool.getMysqlObjByDBName('test');
    connection.query(`SELECT * FROM user WHERE userName='${userName}' and password='${password}'`, function(err, rows, field) {
        if (err) {
            console.log(`SELECT * FROM user WHERE userName='${userName}' and password='${password}'`);
            console.log(err);
            res.send(JSON.stringify({
                ret: -1,
                errorStr: '数据库错误'
            }));
            res.end();
        } else if (rows.length === 0) {
            res.send(JSON.stringify({
                ret: -2,
                errorStr: '请登录'
            }));
            res.end();
        } else {
            //判断有没有权限
            if (rows[0].type !== 1 && rows[0].type !== 2) {
                res.send(JSON.stringify({
                    ret: -1,
                    errorStr: '没有权限'
                }));
                res.end();
                return;
            }
            //可以删除
            let connection = MysqlTool.getMysqlObjByDBName('test');
            connection.query(`DELETE FROM device WHERE deviceid=${deleteDeviceId}`, function(err, rows, field) {
                if (err) {
                    console.log(`DELETE FROM device WHERE deviceid=${deleteDeviceId}`);
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
        }
    });
};

module.exports = outModule;