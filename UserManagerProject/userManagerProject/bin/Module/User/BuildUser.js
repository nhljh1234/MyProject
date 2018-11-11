var outModule = {};
var local = {};
var MysqlTool = require('../../MysqlTool/MysqlTool');

outModule.buildUser = (req, res) => {
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
    let buildName = req.body.userName;
    let buildPassword = req.body.password;
    let buildType = req.body.type;
    if (userType !== 1) {
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
            //检测有没有这个名字
            let connection = MysqlTool.getMysqlObjByDBName('test');
            connection.query(`SELECT * FROM user WHERE userName='${buildName}'`, function(err, rows, field) {
                if (err) {
                    console.log(`SELECT * FROM user WHERE userName='${buildName}'`);
                    console.log(err);
                    res.send(JSON.stringify({
                        ret: -1,
                        errorStr: '数据库错误'
                    }));
                    res.end();
                } else if (rows.length > 0) {
                    res.send(JSON.stringify({
                        ret: -1,
                        errorStr: '该用户名已存在'
                    }));
                    res.end();
                } else {
                    //可以新建用户
                    let connection = MysqlTool.getMysqlObjByDBName('test');
                    connection.query(`INSERT INTO user (userName, password, type) VALUES ('${buildName}', '${buildPassword}', ${buildType})`, function(err, rows, field) {
                        if (err) {
                            console.log(`INSERT INTO user (userName, password, type) VALUES ('${buildName}', '${buildPassword}', ${buildType})`);
                            console.log(err);
                            res.send(JSON.stringify({
                                ret: -1,
                                errorStr: '数据库错误'
                            }));
                            res.end();
                        } else {
                            res.send(JSON.stringify({
                                ret: 1,
                                successStr: '新建账号成功'
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