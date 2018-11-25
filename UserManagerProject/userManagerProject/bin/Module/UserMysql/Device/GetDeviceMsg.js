var outModule = {};
var local = {};
var MysqlTool = require('../../../MysqlTool/MysqlTool');
var GlobalData = require('../../../GlobalData');

outModule.getDeviceMsg = (req, res) => {
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
        userType !== GlobalData.USER_TYPE_BUILDER && userType !== GlobalData.USER_TYPE_CUSTOMER) {
        res.send(JSON.stringify({
            ret: -1,
            errorStr: '没有权限'
        }));
        res.end();
        return;
    }
    let connection = MysqlTool.getMysqlObjByDBName('test');
    connection.query(`SELECT * FROM device`, function(err, rows, field) {
        if (err) {
            console.log(`SELECT * FROM device`);
            console.log(err);
            res.send(JSON.stringify({
                ret: -1,
                errorStr: '数据库错误'
            }));
        } else {
            //session
            if (req.session.userData.type !== GlobalData.USER_TYPE_SUPER) {
                //不是超级权限清除数据
                rows.forEach((oneData) => {
                    oneData.user_name = '';
                    oneData.user_pos = '';
                });
            }
            res.send(JSON.stringify({
                ret: 1,
                dataArr: rows
            }));
        }
        res.end();
    });
};

module.exports = outModule;