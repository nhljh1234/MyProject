var local = {};
var getDeviceTrNode = function(oneData) {
    var keyArr = ['deviceId', 'PM25', 'PM25_C', 'PM10', 'PM10_C', 'noise', 'noise_C', 'temperature', 'temperature_C', 'humidity', 'humidity_C',
        'w_dir', 'w_dir_C', 'w_speed', 'w_speed_C', 'O3', 'O3_C', 'w_power', 'w_power_C', 'screenStr', 'workMode', 'show_O3', 'show_w_dir', 'is_on'
    ];
    var trNode = document.createElement("tr");
    keyArr.forEach(function(keyStr) {
        var value;
        switch (keyStr) {
            case 'show_O3':
            case 'show_w_dir':
            case 'is_on':
                value = oneData[keyStr] ? '是' : '否';
                break;
            default:
                value = oneData[keyStr];
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
    aNode.innerText = "修改设备";
    aNode.onclick = function() {
        showDeviceChangeUI();
        local.selectDeviceId = oneData.deviceId;
        showChangeDeviceMsg(oneData);
    };
    tdNode.appendChild(aNode);
    trNode.appendChild(tdNode);

    tdNode = document.createElement("td");
    aNode = document.createElement("a");
    aNode.href = "#";
    aNode.innerText = "删除设备";
    aNode.onclick = function() {
        $.post('http://localhost:8888/deleteDevice', {
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
    return trNode;
};
var showChangeSellCard = function(data) {
    var keyArr = ['deviceId', 'num', 'can_read', 'finish'];
    if (!local.buildSellCardValue) {
        local.buildSellCardValue = {};
    }
    keyArr.forEach(function(keyStr) {
        var value;
        switch (keyStr) {
            case 'can_read':
            case 'finish':
                local.buildSellCardValue['s_' + keyStr] = data[keyStr];
                value = data[keyStr] ? '是' : '否';
                break;
            default:
                value = data[keyStr];
                break;
        }
        document.getElementById('s_' + keyStr).value = value;
    });
};
var showChangeDeviceMsg = function(data) {
    var keyArr = ['PM25', 'PM25_C', 'PM10', 'PM10_C', 'noise', 'noise_C', 'temperature', 'temperature_C', 'humidity', 'humidity_C',
        'w_dir', 'w_dir_C', 'w_speed', 'w_speed_C', 'O3', 'O3_C', 'w_power', 'w_power_C', 'screenStr', 'workMode', 'show_O3', 'show_w_dir', 'is_on'
    ];
    if (!local.buildDeciveValue) {
        local.buildDeciveValue = {};
    }
    keyArr.forEach(function(keyStr) {
        var value;
        switch (keyStr) {
            case 'show_O3':
            case 'show_w_dir':
            case 'is_on':
                local.buildDeciveValue['v_' + keyStr] = data[keyStr];
                value = data[keyStr] ? '是' : '否';
                break;
            default:
                value = data[keyStr];
                break;
        }
        document.getElementById('v_' + keyStr).value = value || '';
    });
};
var changeDevice = function() {
    $.post('http://localhost:8888/changeDevice', {
        deviceId: local.selectDeviceId,
        PM25: document.getElementById('v_PM25').value || 1,
        PM25_C: document.getElementById('v_PM25_C').value || 1,
        PM10: document.getElementById('v_PM10').value || 1,
        PM10_C: document.getElementById('v_PM10_C').value || 1,
        noise: document.getElementById('v_noise').value || 1,
        noise_C: document.getElementById('v_noise_C').value || 1,
        temperature: document.getElementById('v_temperature').value || 1,
        temperature_C: document.getElementById('v_temperature_C').value || 1,
        humidity: document.getElementById('v_humidity').value || 1,
        humidity_C: document.getElementById('v_humidity_C').value || 1,
        w_dir: document.getElementById('v_w_dir').value || 1,
        w_dir_C: document.getElementById('v_w_dir_C').value || 1,
        w_speed: document.getElementById('v_w_speed').value || 1,
        w_speed_C: document.getElementById('v_w_speed_C').value || 1,
        O3: document.getElementById('v_O3').value || 1,
        O3_C: document.getElementById('v_O3_C').value || 1,
        w_power: document.getElementById('v_w_power').value || 1,
        w_power_C: document.getElementById('v_w_power_C').value || 1,
        screenStr: document.getElementById('v_screenStr').value || '1',
        workMode: document.getElementById('v_workMode').value || 1,
        show_O3: local.buildDeciveValue['v_show_O3'] || 0,
        show_w_dir: local.buildDeciveValue['v_show_w_dir'] || 0,
        is_on: local.buildDeciveValue['v_is_on'] || 0
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
var buildDevice = function() {
    $.post('http://localhost:8888/buildDevice', {
        deviceId: document.getElementById('v_device_id').value || 1
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
var saveBuildSellCardValue = function(key, value, showValue) {
    if (!local.buildSellCardValue) {
        local.buildSellCardValue = {};
    }
    local.buildSellCardValue[key] = value;
    document.getElementById(key).value = showValue;
};
var saveBuildDeviceValue = function(key, value, showValue) {
    if (!local.buildDeciveValue) {
        local.buildDeciveValue = {};
    }
    local.buildDeciveValue[key] = value;
    document.getElementById(key).value = showValue;
};
var getSellCardTrNode = function(oneData) {
    var keyArr = ['deviceId', 'num', 'can_read', 'finish'];
    var trNode = document.createElement("tr");
    keyArr.forEach(function(keyStr) {
        var value;
        switch (keyStr) {
            case 'can_read':
            case 'finish':
                value = oneData[keyStr] ? '是' : '否';
                break;
            default:
                value = oneData[keyStr];
                break;
        }
        var tdNode = document.createElement("td");
        tdNode.innerText = value;
        tdNode.style = "word-break:break-all; word-wrap:break-all;";
        trNode.appendChild(tdNode);
    });
    var tdNode = document.createElement("td");
    var aNode = document.createElement("a");
    aNode.href = "#";
    aNode.innerText = "修改";
    aNode.onclick = function() {
        showChangeSellCardUI();
        showChangeSellCard(oneData);
    };
    tdNode.appendChild(aNode);
    trNode.appendChild(tdNode);

    tdNode = document.createElement("td");
    aNode = document.createElement("a");
    aNode.href = "#";
    aNode.innerText = "删除";
    aNode.onclick = function() {
        $.post('http://localhost:8888/deleteSellCard', {
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
            showSellCardMsgUI();
        }, "json");
    };
    tdNode.appendChild(aNode);
    trNode.appendChild(tdNode);

    tdNode = document.createElement("td");
    aNode = document.createElement("a");
    aNode.href = "#";
    aNode.innerText = "查询快递单";
    aNode.onclick = function() {
        window.open(`http://cha.chawuliu.cn/?stype=kd&q=${oneData.num}`);
    };
    tdNode.appendChild(aNode);
    trNode.appendChild(tdNode);

    return trNode;
};
var changeSellCard = function() {
    if (!local.buildSellCardValue) {
        local.buildSellCardValue = {};
    }
    $.post('http://localhost:8888/changeSellCard', {
        deviceId: document.getElementById('s_deviceId').value || 1,
        num: document.getElementById('s_num').value || 1,
        canRead: local.buildSellCardValue['s_can_read'] || 0,
        finish: local.buildSellCardValue['s_finish'] || 0,
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
var buildSellCard = function() {
    if (!local.buildSellCardValue) {
        local.buildSellCardValue = {};
    }
    $.post('http://localhost:8888/buildSellCard', {
        deviceId: document.getElementById('s_deviceId').value || 1,
        num: document.getElementById('s_num').value || 1,
        canRead: local.buildSellCardValue['s_can_read'] || 0,
        finish: local.buildSellCardValue['s_finish'] || 0,
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
var getShowDataArr = function(dataArr, searchStr, nowShowDataKey) {
    if (!searchStr) {
        return dataArr;
    }
    var searchStrArr = searchStr.split('=');
    if (!nowShowDataKey[searchStrArr[0]]) {
        alert('关键字错误');
        return dataArr;
    } else {
        return dataArr.filter(function(oneData) {
            return ('' + oneData[nowShowDataKey[searchStrArr[0]]]).indexOf(searchStrArr[1]) >= 0;
        });
    }
};
var showSellCardMsg = function(searchStr) {
    var tBodyNode = document.getElementById("tbodySellCard");
    while (tBodyNode.hasChildNodes()) {
        tBodyNode.removeChild(tBodyNode.firstChild);
    }
    local.nowShowType = 'sell_card';
    var nowShowDataKey = {
        '设备id': 'deviceId',
        '订单号': 'num',
        '是否对发货员可见': 'can_read',
        '是否已完成订单': 'finish',
    };
    getShowDataArr(local.sellDataArr, searchStr, nowShowDataKey).forEach(function(oneData) {
        tBodyNode.appendChild(getSellCardTrNode(oneData));
    });
};
var showDeviceMsg = function(searchStr) {
    var tBodyNode = document.getElementById("tbodyDevice");
    while (tBodyNode.hasChildNodes()) {
        tBodyNode.removeChild(tBodyNode.firstChild);
    }
    local.nowShowType = 'device';
    var nowShowDataKey = {
        '设备id': 'deviceId',
        'PM25': 'PM25',
        'PM25修正值': 'PM25_C',
        'PM10': 'PM10',
        'PM10修正值': 'PM10_C',
        '噪音': 'noise',
        '噪音修正值': 'noise_C',
        '温度': 'temperature',
        '温度修正值': 'temperature_C',
        '湿度': 'humidity',
        '湿度修正值': 'humidity_C',
        '风向': 'w_dir',
        '风向修正值': 'w_dir_C',
        '风速': 'w_speed',
        '风速修正值': 'w_speed_C',
        '臭氧': 'O3',
        '臭氧修正值': 'O3_C',
        '风力': 'w_power',
        '风力修正值': 'w_power_C',
        '屏显字符': 'screenStr',
        '喷淋继电器工作模式': 'workMode',
        '是否显示臭氧': 'show_O3',
        '是否显示风向': 'show_w_dir',
        '是否在线': 'is_on'
    };
    getShowDataArr(local.deviceDataArr, searchStr, nowShowDataKey).forEach(function(oneData) {
        tBodyNode.appendChild(getDeviceTrNode(oneData));
    });
};
var search = function() {
    if (window.getComputedStyle(document.getElementById("navButton")).display !== 'none') {
        document.getElementById("navButton").click();
    }
    switch (local.nowShowType) {
        case 'sell_card':
            showSellCardMsg(document.getElementById('searchStr').value);
            break;
        case 'device':
            showDeviceMsg(document.getElementById('searchStr').value);
            break;
    }
};
var showBuildSellCardUI = function() {
    if (window.getComputedStyle(document.getElementById("navButton")).display !== 'none') {
        document.getElementById("navButton").click();
    }
    document.getElementById("deviceData").style.display = 'none';
    document.getElementById("buildDevice").style.display = 'none';
    document.getElementById("changeDevice").style.display = 'none';
    document.getElementById("buildSellCard").style.display = 'block';
    document.getElementById("addSellCardBtn").style.display = 'block';
    document.getElementById("changeSellCardBtn").style.display = 'none';
    document.getElementById("sellCardData").style.display = 'none';
    document.getElementById("sellCardTitle").innerHTML = "增加订单";
};
var showChangeSellCardUI = function() {
    document.getElementById("deviceData").style.display = 'none';
    document.getElementById("buildDevice").style.display = 'none';
    document.getElementById("changeDevice").style.display = 'none';
    document.getElementById("buildSellCard").style.display = 'block';
    document.getElementById("addSellCardBtn").style.display = 'none';
    document.getElementById("changeSellCardBtn").style.display = 'block';
    document.getElementById("sellCardData").style.display = 'none';
    document.getElementById("sellCardTitle").innerHTML = "修改订单";
};
var showBuildDeviceUI = function() {
    if (window.getComputedStyle(document.getElementById("navButton")).display !== 'none') {
        document.getElementById("navButton").click();
    }
    document.getElementById("deviceData").style.display = 'none';
    document.getElementById("buildDevice").style.display = 'block';
    document.getElementById("changeDevice").style.display = 'none';
    document.getElementById("addDeviceBtn").style.display = 'block';
    document.getElementById("changeDeviceBtn").style.display = 'none';
    document.getElementById("buildSellCard").style.display = 'none';
    document.getElementById("sellCardData").style.display = 'none';
    document.getElementById("deviceTitle").innerHTML = "增加设备";
};
var showDeviceChangeUI = function() {
    document.getElementById("deviceData").style.display = 'none';
    document.getElementById("buildDevice").style.display = 'none';
    document.getElementById("changeDevice").style.display = 'block';
    document.getElementById("addDeviceBtn").style.display = 'none';
    document.getElementById("changeDeviceBtn").style.display = 'block';
    document.getElementById("buildSellCard").style.display = 'none';
    document.getElementById("sellCardData").style.display = 'none';
    document.getElementById("deviceTitle").innerHTML = "修改设备";
};
var showDeviceMsgUI = function(isInit) {
    if (isInit === false) {
        if (window.getComputedStyle(document.getElementById("navButton")).display !== 'none') {
            document.getElementById("navButton").click();
        }
    }
    document.getElementById("deviceData").style.display = 'block';
    document.getElementById("buildDevice").style.display = 'none';
    document.getElementById("changeDevice").style.display = 'none';
    document.getElementById("buildSellCard").style.display = 'none';
    document.getElementById("sellCardData").style.display = 'none';
    $.post('http://localhost:8888/getDeviceMsg', undefined, function(result) {
        if (result.ret === -2) {
            alert(result.errorStr);
            window.location.href = 'login.html';
            return;
        }
        if (result.errorStr) {
            alert(result.errorStr);
            return;
        }
        if (result.dataArr) {
            local.deviceDataArr = result.dataArr;
            //发送get请求
            local.deviceDataArr.forEach(function(oneDeviceMsg) {
                $.get("http://xmenvi.wujjc.com:2008/envi/device_cfg/real/" + oneDeviceMsg.deviceId, function(result) {
                    if (!result.DeviceCFG || result.code !== 0) {
                        alert("获取deviceId为" + deviceId + "的设备数据失败");
                        return;
                    }
                    var deviceMsg = result.DeviceCFG;
                    oneDeviceMsg.deviceMsg = deviceMsg;
                    showDeviceMsg();
                });
            });
        }
    }, "json");
};
var showSellCardMsgUI = function() {
    if (window.getComputedStyle(document.getElementById("navButton")).display !== 'none') {
        document.getElementById("navButton").click();
    }
    document.getElementById("deviceData").style.display = 'none';
    document.getElementById("buildDevice").style.display = 'none';
    document.getElementById("changeDevice").style.display = 'none';
    document.getElementById("buildSellCard").style.display = 'none';
    document.getElementById("sellCardData").style.display = 'block';
    $.post('http://localhost:8888/getSellCardMsg', undefined, function(result) {
        if (result.ret === -2) {
            alert(result.errorStr);
            window.location.href = 'login.html';
            return;
        }
        if (result.errorStr) {
            alert(result.errorStr);
            return;
        }
        if (result.dataArr) {
            local.sellDataArr = result.dataArr;
            showSellCardMsg();
        }
    }, "json");
};
(function() {
    showDeviceMsgUI();
})();