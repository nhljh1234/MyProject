var outModule = {};
var local = {};
var MysqlTool = require('../../../MysqlTool/MysqlTool');
var GlobalData = require('../../../GlobalData');

outModule.deleteUser = (req, res) => {
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
    let deleteName = req.body.deleteName;
    if (userType !== GlobalData.USER_TYPE_SUPER) {
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
            if (rows[0].type !== GlobalData.USER_TYPE_SUPER) {
                res.send(JSON.stringify({
                    ret: -1,
                    errorStr: '没有权限'
                }));
                res.end();
                return;
            }
            //需要判断删除的用户是不是超级用户
            let connection = MysqlTool.getMysqlObjByDBName('test');
            connection.query(`SELECT * FROM user WHERE userName='${deleteName}'`, function(err, rows, field) {
                if (err) {
                    console.log(`SELECT * FROM user WHERE userName='${deleteName}'`);
                    console.log(err);
                    res.send(JSON.stringify({
                        ret: -1,
                        errorStr: '数据库错误'
                    }));
                    res.end();
                } else if (rows.length === 0) {
                    res.send(JSON.stringify({
                        ret: -1,
                        errorStr: '数据库错误'
                    }));
                    res.end();
                } else if (rows[0].type === GlobalData.USER_TYPE_SUPER) {
                    res.send(JSON.stringify({
                        ret: -1,
                        errorStr: '无法删除超级管理员'
                    }));
                    res.end();
                } else {
                    //可以删除
                    let connection = MysqlTool.getMysqlObjByDBName('test');
                    connection.query(`DELETE FROM user WHERE userName='${deleteName}'`, function(err, rows, field) {
                        if (err) {
                            console.log(`DELETE FROM user WHERE userName='${deleteName}'`);
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
        }
    });
};

module.exports = outModule;