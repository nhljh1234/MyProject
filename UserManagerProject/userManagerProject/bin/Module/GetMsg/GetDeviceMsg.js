var outModule = {};
var local = {};
var MysqlTool = require('../../MysqlTool/MysqlTool');

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
            if (req.session.userData.type === 2) {
                //不是超级权限清除数据
                rows.forEach((oneData) => {
                    oneData.user_name = undefined;
                    oneData.user_pos = undefined;
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