let deviceChangeDataSave = {};
var buildDevice = function() {
    $.post('http://localhost:8888/buildDevice', {
        deviceId: document.getElementById('b_device_id').value || 1,
        customerName: document.getElementById('b_customer_name') ? document.getElementById('b_customer_name').value : '空',
        customerPhone: document.getElementById('b_customer_phone') ? document.getElementById('b_customer_phone').value : '空',
        customerPos: document.getElementById('b_customer_pos') ? document.getElementById('b_customer_pos').value : '空',
        customerArea: document.getElementById('b_customer_area') ? document.getElementById('b_customer_area').value : '空'
    }, function(result) {
        if (result.ret === -2) {
            alert(result.errorStr);
            window.location.href = 'login.html';
            return;
        }
        if (result.errorStr) {
            alert(result.errorStr);
            return;
        }
        if (result.successStr) {
            alert(result.successStr);
        }
    }, "json");
};
var saveChangeDeviceValue = function(key, value, showStr) {
    document.getElementById(key).value = showStr;
    deviceChangeDataSave[key] = value;
    if (key === 'v_control_type') {
        showUIbyModeType(value);
    }
};

var showUIbyModeType = function(mode) {
    mode = parseInt(mode);
    document.getElementById('mode_1').style.display = (mode === 1 ? 'block' : 'none');
    document.getElementById('mode_2').style.display = (mode === 2 ? 'block' : 'none');
    document.getElementById('mode_3').style.display = (mode === 3 ? 'block' : 'none');
};

var showChangeDeviceMsg = function(data) {
    showUIbyModeType(local.selectDeviceData.CPDataObj.mode);
    var showType = {
        251: '显示风力',
        255: '显示TSP',
        507: '显示臭氧',
        0: '无',
    };
    var controlType = {
        0: '无工作模式',
        1: '指标模式',
        2: '定时模式',
        3: '手动模式'
    };

    var getContorlCheck = function(str, node_1, node_2, node_3, node_4) {
        str = '' + str;
        node_1.checked = false;
        node_2.checked = false;
        node_3.checked = false;
        node_4.checked = false;
        switch (str) {
            case '01':
                node_1.checked = true;
                break;
            case '02':
                node_2.checked = true;
                break;
            case '03':
                node_1.checked = true;
                node_2.checked = true;
                break;
            case '04':
                node_3.checked = true;
                break;
            case '05':
                node_1.checked = true;
                node_3.checked = true;
                break;
            case '06':
                node_2.checked = true;
                node_3.checked = true;
                break;
            case '07':
                node_1.checked = true;
                node_2.checked = true;
                node_3.checked = true;
                break;
            case '08':
                node_4.checked = true;
                break;
            case '09':
                node_1.checked = true;
                node_4.checked = true;
                break;
            case '10':
                node_2.checked = true;
                node_4.checked = true;
                break;
            case '11':
                node_1.checked = true;
                node_2.checked = true;
                node_4.checked = true;
                break;
            case '12':
                node_3.checked = true;
                node_4.checked = true;
                break;
            case '13':
                node_1.checked = true;
                node_3.checked = true;
                node_4.checked = true;
                break;
            case '14':
                node_2.checked = true;
                node_3.checked = true;
                node_4.checked = true;
                break;
            case '14':
                node_1.checked = true;
                node_2.checked = true;
                node_3.checked = true;
                node_4.checked = true;
                break;
        }
    };

    var CPDataObj = local.selectDeviceData.CPDataObj;
    document.getElementById('v_screenStr').value = CPDataObj.title;
    document.getElementById('v_show_type').value = showType[CPDataObj.sensor_enable] || '';
    deviceChangeDataSave.v_show_type = CPDataObj.sensor_enable;
    document.getElementById('v_control_type').value = controlType[CPDataObj.mode] || controlType[0];
    deviceChangeDataSave.v_control_type = CPDataObj.mode;

    var PM25Str = CPDataObj.pm25.split(',');
    var PM10Str = CPDataObj.pm10.split(',');
    document.getElementById('v_PM25_low').value = PM25Str[0];
    document.getElementById('v_PM25_high').value = PM25Str[1];
    document.getElementById('v_PM10_low').value = PM10Str[0];
    document.getElementById('v_PM10_high').value = PM10Str[1];

    var timeStr = CPDataObj.times.split(',');
    var showTimeStr = '';
    var k = 1;
    for (var i = 0; i < 8; i++, k++) {
        showTimeStr = '';
        showTimeStr = showTimeStr + timeStr[i].substring(0, 2) + ":" + timeStr[i].substring(2, 4);
        showTimeStr = showTimeStr + "-";
        showTimeStr = showTimeStr + timeStr[i + 1].substring(0, 2) + ":" + timeStr[i + 1].substring(2, 4);
        i++;
        document.getElementById('v_time_' + k).value = showTimeStr;
    }
    getContorlCheck(CPDataObj.timeon, document.getElementById('v_time_ckeck_1'), document.getElementById('v_time_ckeck_2'),
        document.getElementById('v_time_ckeck_3'), document.getElementById('v_time_ckeck_4'));

    var switchStr = CPDataObj.switchs.split(',');
    getContorlCheck(switchStr[0], document.getElementById('v_open_ckeck_1'), document.getElementById('v_open_ckeck_2'),
        document.getElementById('v_open_ckeck_3'), document.getElementById('v_open_ckeck_4'));
    getContorlCheck(switchStr[1], document.getElementById('v_close_ckeck_1'), document.getElementById('v_close_ckeck_2'),
        document.getElementById('v_close_ckeck_3'), document.getElementById('v_close_ckeck_4'));

    if (document.getElementById('v_customer_name')) {
        for (var i = 0; i < local.deviceDataArr.length; i++) {
            if (local.deviceDataArr[i].deviceId === local.selectDeviceId) {
                document.getElementById('v_customer_name') && (document.getElementById('v_customer_name').value = local.deviceDataArr[i].customerName);
                document.getElementById('v_customer_phone') && (document.getElementById('v_customer_phone').value = local.deviceDataArr[i].customerPhone);
                document.getElementById('v_customer_pos').value = local.deviceDataArr[i].customerPos;
                document.getElementById('v_customer_area').value = local.deviceDataArr[i].customerArea;
            }
        }
    }
};
var changeDevice = function() {
    if (document.getElementById('v_customer_name')) {
        $.post('http://localhost:8888/changeDevice', {
            deviceId: local.selectDeviceId,
            customerName: document.getElementById('v_customer_name') ? document.getElementById('v_customer_name').value : undefined,
            customerPhone: document.getElementById('v_customer_name') ? document.getElementById('v_customer_phone').value : undefined,
            customerPos: document.getElementById('v_customer_pos').value,
            customerArea: document.getElementById('v_customer_area').value
        }, function(result) {

        }, "json");
    }

    var getContorlCheck = function(node_1, node_2, node_3, node_4) {
        let num = 0;
        num = num + (node_1.checked ? 1 : 0);
        num = num + (node_2.checked ? 2 : 0);
        num = num + (node_3.checked ? 4 : 0);
        num = num + (node_4.checked ? 8 : 0);
        if (num < 10) {
            return '0' + num;
        }
        return '' + num;
    };

    var param = "";

    var title = document.getElementById('v_screenStr').value;
    if (title.replace(/[\u0391-\uFFE5]/g, "aa").length >= 36) {
        alert('字符数超出');
        return;
    }
    //param = param + 'title=' + document.getElementById('v_screenStr').value + ";";

    switch (deviceChangeDataSave['v_control_type']) {
        case 0:
            param = param + 'mode=0;';
            break;
        case 1:
            param = param + 'mode=1;';
            param = param + 'pm25=' + document.getElementById('v_PM25_low').value + ',' +
                document.getElementById('v_PM25_high').value + ';';
            param = param + 'pm10=' + document.getElementById('v_PM10_low').value + ',' +
                document.getElementById('v_PM10_high').value + ';';
            break;
        case 2:
            param = param + 'mode=2;';
            param = param + 'times=';
            ['v_time_1', 'v_time_2', 'v_time_3', 'v_time_4'].forEach(function(id, index) {
                var str = document.getElementById(id).value;
                if (str.indexOf('-') < 0) {
                    alert('时间格式错误');
                    return;
                }
                var timeStrArr = str.split('-');
                timeStrArr[0] = timeStrArr[0].replace(':', '');
                timeStrArr[1] = timeStrArr[1].replace(':', '');
                if (timeStrArr[0].length !== 4 || timeStrArr[1].length !== 4) {
                    alert('时间格式错误');
                    return;
                }
                param = param + timeStrArr[0] + ',' + timeStrArr[1];
                if (index !== 3) {
                    param = param + ',';
                } else {
                    param = param + ';';
                }
            });
            param = param + 'timeon=' + getContorlCheck(document.getElementById('v_time_ckeck_1'), document.getElementById('v_time_ckeck_2'),
                document.getElementById('v_time_ckeck_3'), document.getElementById('v_time_ckeck_4')) + ';';
            break;
        case 3:
            param = param + 'mode=3;';
            param = param + 'switchs=' + getContorlCheck(document.getElementById('v_open_ckeck_1'), document.getElementById('v_open_ckeck_2'),
                document.getElementById('v_open_ckeck_3'), document.getElementById('v_open_ckeck_4'));
            param = param + ',';
            param = param + getContorlCheck(document.getElementById('v_close_ckeck_1'), document.getElementById('v_close_ckeck_2'),
                document.getElementById('v_close_ckeck_3'), document.getElementById('v_close_ckeck_4'));
            param = param + ';';
            break;
    }
    param = param + 'sensor_enable=' + deviceChangeDataSave.v_show_type + ';';
    $.ajax({
        url: "http://xmenvi.wujjc.com:2008/envi/device_cfg",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            device: local.selectDeviceId,
            allcfg: param
        }),
        success: function(result) {
            if (result.code === 0) {
                alert("设置成功");
            } else {
                alert("设置失败");
            }
        },
        error: function(error) {
            alert("设置失败");
        }
    });
};