var outModule = {};
var local = {};
var MysqlTool = require('../../MysqlTool/MysqlTool');

outModule.checkUser = (req, res) => {
    //判断session
    if (req.session && req.session.userData) {
        console.log('111');
        res.send(JSON.stringify({
            ret: 1,
            userType: req.session.userData.type
        }));
        res.end();
        return;
    }
    if (!req.body) {
        res.send(JSON.stringify({
            ret: -1,
            errorStr: '服务端解析错误'
        }));
        res.end();
        return;
    }
    let userName = req.body.userName;
    let password = req.body.password;
    if (!userName || !password) {
        res.send(JSON.stringify({
            ret: -1,
            errorStr: '参数错误'
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
        } else if (rows.length === 0) {
            res.send(JSON.stringify({
                ret: -1,
                errorStr: '用户名或者密码错误'
            }));
        } else {
            //session
            req.session.userData = rows[0];
            res.send(JSON.stringify({
                ret: 1,
                userType: rows[0].type
            }));
        }
        res.end();
    });
};

module.exports = outModule;