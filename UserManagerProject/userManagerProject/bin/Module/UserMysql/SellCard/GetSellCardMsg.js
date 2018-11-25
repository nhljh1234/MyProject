var outModule = {};
var local = {};
var MysqlTool = require('../../../MysqlTool/MysqlTool');
var GlobalData = require('../../../GlobalData');

outModule.getSellCardMsg = (req, res) => {
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
    let connection = MysqlTool.getMysqlObjByDBName('test');
    connection.query(`SELECT * FROM sell_card`, function(err, rows, field) {
        if (err) {
            console.log(`SELECT * FROM sell_card`);
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
            //发货员
            if (req.session.userData.type === GlobalData.USER_TYPE_DELIVERY_PERSON) {
                let dataArr = [];
                rows.forEach((oneData) => {
                    if (oneData.can_read === 1) {
                        oneData.can_read = undefined;
                        dataArr.push(oneData);
                    }
                });
                rows = dataArr;
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