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
    connection.query(`SELECT * FROM server_msg`, function(err, rows, field) {
        if (err) {
            console.log(`SELECT * FROM server_msg`);
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
        } else {
            let maxDeviceId = rows[0].maxDeviceId;
            maxDeviceId++;
            let connection = MysqlTool.getMysqlObjByDBName('test');
            connection.query(`INSERT INTO device (deviceId, PM25, PM25_C, PM10, PM10_C, noise, noise_C, temperature, temperature_C, 
                humidity, humidity_C, w_dir, w_dir_C, w_speed, w_speed_C, O3, O3_C, w_power, w_power_C, screenStr, workMode, show_O3,
                show_w_dir, user_name, user_pos, is_on) VALUES (${maxDeviceId}, ${data.PM25}, ${data.PM25_C}, ${data.PM10},
                ${data.PM10_C}, ${data.noise}, ${data.noise_C}, ${data.temperature}, ${data.temperature_C},
                ${data.humidity}, ${data.humidity_C}, ${data.w_dir}, ${data.w_dir_C}, ${data.w_speed}, ${data.w_speed_C}, 
                ${data.O3}, ${data.O3_C}, ${data.w_power}, ${data.w_power_C}, '${data.screenStr}', ${data.workMode}, 
                ${data.show_O3}, ${data.show_w_dir}, '${data.user_name}', '${data.user_pos}', ${data.is_on})`, function(err, rows, field) {
                if (err) {
                    console.log(`build device`);
                    console.log(err);
                    res.send(JSON.stringify({
                        ret: -1,
                        errorStr: '数据库错误'
                    }));
                    res.end();
                } else {
                    let connection = MysqlTool.getMysqlObjByDBName('test');
                    connection.query(`UPDATE server_msg set maxDeviceId=${maxDeviceId}`, function(err, rows, field) {
                        if (err) {
                            console.log(`UPDATE server_msg set maxDeviceId=${maxDeviceId}`);
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
        }
    });
};

module.exports = outModule;