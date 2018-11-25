var showDeviceMsg = function(searchStr) {
    var tBodyNode = document.getElementById("tbodyDevice");
    while (tBodyNode.hasChildNodes()) {
        tBodyNode.removeChild(tBodyNode.firstChild);
    }
    local.nowShowType = 'device';
    getShowDataArr(local.deviceDataArr, searchStr).forEach(function(oneData) {
        tBodyNode.appendChild(getDeviceTrNode(oneData));
    });
};

var getDeviceTrNode = function(oneData) {
    var keyArr = [];
    if (localStorage.getItem('userType') === '1') {
        keyArr = ['deviceId', 'customerName', 'customerPhone', 'customerPos', 'customerArea'];
    } else if (localStorage.getItem('userType') === '2') {
        keyArr = ['deviceId', 'customerPos', 'customerArea'];
    } else if (localStorage.getItem('userType') === '4' || localStorage.getItem('userType') === '5') {
        keyArr = ['deviceId'];
    }
    var trNode = document.createElement("tr");
    keyArr.forEach(function(keyStr) {
        var value;
        switch (keyStr) {
            default: value = oneData[keyStr];
            break;
        }
        var tdNode = document.createElement("td");
        tdNode.innerText = value || "";
        tdNode.style = "word-break:break-all; word-wrap:break-all;";
        trNode.appendChild(tdNode);
    });
    var tdNode = document.createElement("td");
    var aNode = document.createElement("a");
    aNode.href = "#";
    aNode.innerText = "显示详细信息";
    aNode.onclick = function() {
        local.selectDeviceId = oneData.deviceId;
        showDeviceDetailMsgUI();
    };
    tdNode.appendChild(aNode);
    trNode.appendChild(tdNode);

    if (localStorage.getItem('userType') === '1' || localStorage.getItem('userType') === '2') {
        tdNode = document.createElement("td");
        aNode = document.createElement("a");
        aNode.href = "#";
        aNode.innerText = "删除设备";
        aNode.onclick = function() {
            $.post('http://47.92.253.131:3389/deleteDevice', {
                deleteDeviceId: oneData.deviceId
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
                showDeviceMsgUI();
            }, "json");
        };
        tdNode.appendChild(aNode);
        trNode.appendChild(tdNode);
    }

    return trNode;
};

var getDetailTrNode = function(key, value) {
    var trNode = document.createElement("tr");
    var tdKeyNode = document.createElement("td");
    var tdValueNode = document.createElement("td");
    tdKeyNode.width = "120px";
    tdKeyNode.innerText = key;
    tdValueNode.innerText = value;
    tdValueNode.style = "word-break:break-all; word-wrap:break-all;";
    trNode.appendChild(tdKeyNode);
    trNode.appendChild(tdValueNode);
    return trNode;
};

var updateDeviceDetailUI = function(showData_1, showData_2) {
    var CPDataObj = {};
    var deviceDetaiChange = {
        Deviceid: "设备id",
        PM25: "PM25",
        PM10: "PM10",
        TSP: "TSP",
        B03: "噪音",
        W01: "风向",
        W02: "风速",
        T01: "温度",
        H01: "湿度",
        O3: "臭氧",
        screenStr: "屏显字符",
        showType: "显示类型",
        controlType: "继电器控制类型",
        onLine: "是否在线"
    };
    var getSensorData = function(CPData) {
        var arr = CPData.split(";");
        var SensorStr;
        arr.forEach(function(str) {
            var strArr = str.split("=");
            CPDataObj[strArr[0]] = strArr[1];
        });
    };
    var getContorl = function(str) {
        str = '' + str;
        switch (str) {
            case '01':
                return 'k1';
            case '02':
                return 'k2';
            case '03':
                return 'k1 k2';
            case '04':
                return 'k3';
            case '05':
                return 'k1 k3';
            case '06':
                return 'k2 k3';
            case '07':
                return 'k1 k2 k3';
            case '08':
                return 'k4';
            case '09':
                return 'k1 k4';
            case '10':
                return 'k2 k4';
            case '11':
                return 'k1 k2 k4';
            case '12':
                return 'k3 k4';
            case '13':
                return 'k1 k3 k4';
            case '14':
                return 'k2 k3 k4';
            case '14':
                return 'k1 k2 k3 k4';
        }
        return '无';
    };
    var getWindDir = function(w_dir) {
        w_dir = parseFloat(w_dir);
        if (w_dir <= 22.5 && w_dir > 337.5) {
            return '北';
        } else if (w_dir <= 67.5 && w_dir > 22.5) {
            return '东北';
        } else if (w_dir <= 112.5 && w_dir > 67.5) {
            return '东';
        } else if (w_dir <= 157.5 && w_dir > 112.5) {
            return '东南';
        } else if (w_dir <= 202.5 && w_dir > 157.5) {
            return '南';
        } else if (w_dir <= 247.5 && w_dir > 202.5) {
            return '西南';
        } else if (w_dir <= 292.5 && w_dir > 247.5) {
            return '西';
        } else if (w_dir <= 337.5 && w_dir > 292.5) {
            return '西北';
        }
        return '无';
    };
    //保证顺序
    var showData = {},
        key;
    for (key in showData_1) {
        if (!showData_1.hasOwnProperty(key)) {
            continue;
        }
        showData[key] = showData_1[key];
    }
    for (key in showData_2) {
        if (!showData_2.hasOwnProperty(key)) {
            continue;
        }
        showData[key] = showData_2[key];
    }
    if (showData["CP"]) {
        getSensorData(showData["CP"]);
    }
    local.selectDeviceData = showData;
    local.selectDeviceData.CPDataObj = CPDataObj;
    var tBodyNode = document.getElementById("deviceDetailData");
    while (tBodyNode.hasChildNodes()) {
        tBodyNode.removeChild(tBodyNode.firstChild);
    }
    for (key in deviceDetaiChange) {
        if (!deviceDetaiChange.hasOwnProperty(key)) {
            continue;
        }
        var showStr = showData[key];
        switch (key) {
            case 'PM25':
            case 'PM10':
            case 'TSP':
            case 'B03':
            case 'W02':
            case 'T01':
            case 'H01':
                showStr = parseInt(showStr) / 10;
                break;
            case 'W01':
                showStr = getWindDir(showStr / 10);
                break;
            case 'O3':
                showStr = parseInt(showStr) / 100 + 'ppm';
                break;
            case 'screenStr':
                showStr = CPDataObj.title;
                break;
            case 'showType':
                switch (parseInt(CPDataObj.sensor_enable)) {
                    case 251:
                        showStr = '显示风力';
                        break;
                    case 255:
                        showStr = '显示TSP';
                        break;
                    case 507:
                        showStr = '显示臭氧';
                        break;
                    default:
                        showStr = '无';
                        break;
                }
                break;
            case 'controlType':
                switch (parseInt(CPDataObj.mode)) {
                    case 0:
                        showStr = '无工作模式';
                        break;
                    case 1:
                        showStr = '指标模式';
                        break;
                    case 2:
                        showStr = '定时模式';
                        break;
                    case 3:
                        showStr = '手动模式';
                        break;
                }
                break;
            case 'onLine':
                var time = showData.DataTime;
                var year = parseInt(time.substring(0, 4));
                var month = parseInt(time.substring(4, 6));
                var day = parseInt(time.substring(6, 8));
                var hour = parseInt(time.substring(8, 10));
                var minute = parseInt(time.substring(10, 12));
                var second = parseInt(time.substring(12, 14));
                var deviceDate = new Date(year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second);
                var nowDate = new Date();
                if (Math.ceil(Math.abs(nowDate.getTime() - deviceDate.getTime()) / 1000) >= 3 * 60) {
                    showStr = '不在线';
                } else {
                    showStr = '在线';
                }
                break;
        }
        tBodyNode.appendChild(getDetailTrNode(deviceDetaiChange[key] || key, showStr));
    }
    if (parseInt(CPDataObj.mode) === 0) {

    } else if (parseInt(CPDataObj.mode) === 1) {
        var PM25Str = CPDataObj.pm25.split(',');
        var PM10Str = CPDataObj.pm10.split(',');
        tBodyNode.appendChild(getDetailTrNode('PM25下限', parseInt(PM25Str[0]) / 10));
        tBodyNode.appendChild(getDetailTrNode('PM25上限', parseInt(PM25Str[1]) / 10));
        tBodyNode.appendChild(getDetailTrNode('PM10下限', parseInt(PM10Str[0]) / 10));
        tBodyNode.appendChild(getDetailTrNode('PM10上限', parseInt(PM10Str[1]) / 10));
    } else if (parseInt(CPDataObj.mode) === 2) {
        var timeStr = CPDataObj.times.split(',');
        var showTimeStr = '';
        for (var i = 0; i < 8; i++) {
            showTimeStr = showTimeStr + timeStr[i].substring(0, 2) + ":" + timeStr[i].substring(2, 4);
            showTimeStr = showTimeStr + "-";
            showTimeStr = showTimeStr + timeStr[i + 1].substring(0, 2) + ":" + timeStr[i + 1].substring(2, 4);
            showTimeStr = showTimeStr + " ";
            i++;
        }
        var controlStr = getContorl(CPDataObj.timeon);
        tBodyNode.appendChild(getDetailTrNode('作用时段', showTimeStr));
        tBodyNode.appendChild(getDetailTrNode('作用开关', controlStr));
    } else if (parseInt(CPDataObj.mode) === 3) {
        var switchStr = CPDataObj.switchs.split(',');
        var openStr = getContorl(switchStr[0]);
        var closeStr = getContorl(switchStr[1]);
        tBodyNode.appendChild(getDetailTrNode('开启开关', openStr));
        tBodyNode.appendChild(getDetailTrNode('关闭开关', closeStr));
    }
};

var showDeviceDetailMsg = function() {
    if (!local.selectDeviceId) {
        return;
    }
    var questNum = 0;
    var showData_1 = {};
    var showData_2 = {};
    $.get("http://xmenvi.wujjc.com:2008/envi/device_wd/real?device=" + local.selectDeviceId, function(result) {
        if (!result.device_wd || !result.device_wd.length || result.code !== 0) {
            alert("数据获取失败");
            window.location.href = 'login.html';
            return;
        }
        var deviceData = result.device_wd[0];
        for (var key in deviceData) {
            if (!deviceData.hasOwnProperty(key)) {
                continue;
            }
            showData_1[key] = deviceData[key];
        }
        questNum++;
        if (questNum === 2) {
            updateDeviceDetailUI(showData_1, showData_2);
        }
    });
    $.get("http://xmenvi.wujjc.com:2008/envi/device_cfg/real/" + local.selectDeviceId, function(result) {
        if (!result.DeviceCFG || result.code !== 0) {
            alert("数据获取失败");
            window.location.href = 'login.html';
            return;
        }
        var deviceData = result.DeviceCFG;
        for (var key in deviceData) {
            if (!deviceData.hasOwnProperty(key)) {
                continue;
            }
            showData_2[key] = deviceData[key];
        }
        questNum++;
        if (questNum === 2) {
            updateDeviceDetailUI(showData_1, showData_2);
        }
    });
};