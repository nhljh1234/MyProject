var outModule = {};
var local = {};
var MysqlTool = require('../../MysqlTool/MysqlTool');

outModule.changeDevice = (req, res) => {
    //判断session
    if (!req.session || !req.session.userData) {
        res.send(JSON.stringify({
            ret: -2,
            errorStr: '请登录'
        }));
        res.end();
        return;
    }
    //判断修改权限
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
            console.log(`SELECT * FROM device WHERE deviceId=${data.deviceId}`);
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
            if (userType === 1) {
                mysqlStr = `UPDATE device SET PM25=${data.PM25}, PM25_C=${data.PM25_C}, PM10=${data.PM10},
                PM10_C=${data.PM10_C}, noise=${data.noise}, noise_C=${data.noise_C}, temperature=${data.temperature}, temperature_C=${data.temperature_C}, 
                humidity=${data.humidity}, humidity_C=${data.humidity_C}, w_dir=${data.w_dir}, w_dir_C=${data.w_dir_C}, w_speed=${data.w_speed},
                w_speed_C=${data.w_speed_C}, O3=${data.O3}, O3_C=${data.O3_C}, w_power=${data.w_power}, w_power_C=${data.w_power_C}, 
                screenStr='${data.screenStr}', workMode=${data.workMode}, show_O3=${data.show_O3}, show_w_dir=${data.show_w_dir}, 
                is_on=${data.is_on} WHERE deviceId=${data.deviceId}`;
            } else if (userType === 2) {
                mysqlStr = `UPDATE device SET PM25=${data.PM25}, PM25_C=${data.PM25_C}, PM10=${data.PM10},
                PM10_C=${data.PM10_C}, noise=${data.noise}, noise_C=${data.noise_C}, temperature=${data.temperature}, temperature_C=${data.temperature_C}, 
                humidity=${data.humidity}, humidity_C=${data.humidity_C}, w_dir=${data.w_dir}, w_dir_C=${data.w_dir_C}, w_speed=${data.w_speed},
                w_speed_C=${data.w_speed_C}, O3=${data.O3}, O3_C=${data.O3_C}, w_power=${data.w_power}, w_power_C=${data.w_power_C}, 
                screenStr='${data.screenStr}', workMode=${data.workMode}, show_O3=${data.show_O3}, show_w_dir=${data.show_w_dir}, 
                is_on=${data.is_on} WHERE deviceId=${data.deviceId}`;
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
                        successStr: '修改设备信息成功'
                    }));
                    res.end();
                }
            });
        }
    });
};

module.exports = outModule;