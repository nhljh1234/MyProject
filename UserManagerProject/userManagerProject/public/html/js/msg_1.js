var local = {};
var getDeviceTrNode = function(oneData) {
    var keyArr = ['deviceId', 'PM25', 'PM25_C', 'PM10', 'PM10_C', 'noise', 'noise_C', 'temperature', 'temperature_C', 'humidity', 'humidity_C',
        'w_dir', 'w_dir_C', 'w_speed', 'w_speed_C', 'O3', 'O3_C', 'w_power', 'w_power_C', 'screenStr', 'workMode', 'show_O3', 'show_w_dir', 'user_name',
        'user_pos', 'is_on'
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
        tdNode.innerText = value;
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
    return trNode;
};
var showChangeSellCard = function(data) {
    var keyArr = ['deviceId', 'num', 'user_name', 'user_pos', 'can_read', 'finish'];
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
        'w_dir', 'w_dir_C', 'w_speed', 'w_speed_C', 'O3', 'O3_C', 'w_power', 'w_power_C', 'screenStr', 'workMode', 'show_O3', 'show_w_dir', 'user_name',
        'user_pos', 'is_on'
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
        document.getElementById('v_' + keyStr).value = value;
    });
};
var changeDevice = function() {
    $.post('http://47.92.253.131:3389/changeDevice', {
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
        user_name: document.getElementById('v_user_name').value || '1',
        user_pos: document.getElementById('v_user_pos').value || '1',
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
    $.post('http://47.92.253.131:3389/buildDevice', {
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
        user_name: document.getElementById('v_user_name').value || '1',
        user_pos: document.getElementById('v_user_pos').value || '1',
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
    var keyArr = ['deviceId', 'num', 'user_name', 'user_pos', 'can_read', 'finish'];
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
        $.post('http://47.92.253.131:3389/deleteSellCard', {
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
var getUserTrNode = function(oneData) {
    var keyArr = ['userName', 'password', 'type'];
    var typeStr = ['超级管理员', '客户管理员', '发货员'];
    var trNode = document.createElement("tr");
    keyArr.forEach(function(keyStr) {
        var value;
        switch (keyStr) {
            case 'type':
                value = typeStr[oneData[keyStr] - 1];
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
    aNode.innerText = "删除";
    aNode.onclick = function() {
        if (localStorage.getItem('userType') !== '1') {
            alert('没有权限');
            return;
        }
        if (oneData.type === 1) {
            alert('无法删除超级管理员');
            return;
        }
        $.post('http://47.92.253.131:3389/deleteUser', {
            deleteName: oneData.userName
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
            showUserMsgUI();
        }, "json");
    };
    tdNode.appendChild(aNode);
    trNode.appendChild(tdNode);
    return trNode;
};
var buildUser = function() {
    var buildName = document.getElementById("buildUserName").value;
    var buildPassword = document.getElementById("buildPassword").value;
    var buildType = local.buildUserType;
    if (!buildName || !buildPassword || (buildType !== 1 && buildType !== 2 && buildType !== 3)) {
        alert('参数错误');
        return;
    }
    $.post('http://47.92.253.131:3389/buildUser', {
        userName: buildName,
        password: buildPassword,
        type: buildType
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
var changeSellCard = function() {
    if (!local.buildSellCardValue) {
        local.buildSellCardValue = {};
    }
    $.post('http://47.92.253.131:3389/changeSellCard', {
        deviceId: document.getElementById('s_deviceId').value || 1,
        num: document.getElementById('s_num').value || 1,
        userName: document.getElementById('s_user_name').value || '1',
        userPos: document.getElementById('s_user_pos').value || '1',
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
    $.post('http://47.92.253.131:3389/buildSellCard', {
        deviceId: document.getElementById('s_deviceId').value || 1,
        num: document.getElementById('s_num').value || 1,
        userName: document.getElementById('s_user_name').value || '1',
        userPos: document.getElementById('s_user_pos').value || '1',
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
var showSellCardMsg = function() {
    var tBodyNode = document.getElementById("tbodySellCard");
    while (tBodyNode.hasChildNodes()) {
        tBodyNode.removeChild(tBodyNode.firstChild);
    }
    local.sellDataArr.forEach(function(oneData) {
        tBodyNode.appendChild(getSellCardTrNode(oneData));
    });
};
var showDeviceMsg = function() {
    var tBodyNode = document.getElementById("tbodyDevice");
    while (tBodyNode.hasChildNodes()) {
        tBodyNode.removeChild(tBodyNode.firstChild);
    }
    local.deviceDataArr.forEach(function(oneData) {
        tBodyNode.appendChild(getDeviceTrNode(oneData));
    });
};
var showUserMsg = function() {
    var tBodyNode = document.getElementById("tbodyUser");
    while (tBodyNode.hasChildNodes()) {
        tBodyNode.removeChild(tBodyNode.firstChild);
    }
    local.userDataArr.forEach(function(oneData) {
        tBodyNode.appendChild(getUserTrNode(oneData));
    });
};
var showSelectType = function(type, selectStr) {
    local.buildUserType = type;
    document.getElementById("buildUserType").value = selectStr;
};
var showBuildSellCardUI = function() {
    document.getElementById("deviceData").style.display = 'none';
    document.getElementById("userData").style.display = 'none';
    document.getElementById("buildUser").style.display = 'none';
    document.getElementById("buildDevice").style.display = 'none';
    document.getElementById("buildSellCard").style.display = 'block';
    document.getElementById("addSellCardBtn").style.display = 'block';
    document.getElementById("changeSellCardBtn").style.display = 'none';
    document.getElementById("sellCardData").style.display = 'none';
    document.getElementById("sellCardTitle").innerHTML = "增加订单";
};
var showChangeSellCardUI = function() {
    document.getElementById("deviceData").style.display = 'none';
    document.getElementById("userData").style.display = 'none';
    document.getElementById("buildUser").style.display = 'none';
    document.getElementById("buildDevice").style.display = 'none';
    document.getElementById("buildSellCard").style.display = 'block';
    document.getElementById("addSellCardBtn").style.display = 'none';
    document.getElementById("changeSellCardBtn").style.display = 'block';
    document.getElementById("sellCardData").style.display = 'none';
    document.getElementById("sellCardTitle").innerHTML = "修改订单";
};
var showBuildDeviceUI = function() {
    document.getElementById("deviceData").style.display = 'none';
    document.getElementById("userData").style.display = 'none';
    document.getElementById("buildUser").style.display = 'none';
    document.getElementById("buildDevice").style.display = 'block';
    document.getElementById("addDeviceBtn").style.display = 'block';
    document.getElementById("changeDeviceBtn").style.display = 'none';
    document.getElementById("buildSellCard").style.display = 'none';
    document.getElementById("sellCardData").style.display = 'none';
    document.getElementById("deviceTitle").innerHTML = "增加设备";
};
var showDeviceChangeUI = function() {
    document.getElementById("deviceData").style.display = 'none';
    document.getElementById("userData").style.display = 'none';
    document.getElementById("buildUser").style.display = 'none';
    document.getElementById("buildDevice").style.display = 'block';
    document.getElementById("addDeviceBtn").style.display = 'none';
    document.getElementById("changeDeviceBtn").style.display = 'block';
    document.getElementById("buildSellCard").style.display = 'none';
    document.getElementById("sellCardData").style.display = 'none';
    document.getElementById("deviceTitle").innerHTML = "修改设备";
};
var showBuildUserUI = function() {
    document.getElementById("deviceData").style.display = 'none';
    document.getElementById("userData").style.display = 'none';
    document.getElementById("buildUser").style.display = 'block';
    document.getElementById("buildDevice").style.display = 'none';
    document.getElementById("buildSellCard").style.display = 'none';
    document.getElementById("sellCardData").style.display = 'none';
};
var showDeviceMsgUI = function() {
    document.getElementById("deviceData").style.display = 'block';
    document.getElementById("userData").style.display = 'none';
    document.getElementById("buildUser").style.display = 'none';
    document.getElementById("buildDevice").style.display = 'none';
    document.getElementById("buildSellCard").style.display = 'none';
    document.getElementById("sellCardData").style.display = 'none';
    $.post('http://47.92.253.131:3389/getDeviceMsg', undefined, function(result) {
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
            showDeviceMsg();
        }
    }, "json");
};
var showSellCardMsgUI = function() {
    document.getElementById("deviceData").style.display = 'none';
    document.getElementById("userData").style.display = 'none';
    document.getElementById("buildUser").style.display = 'none';
    document.getElementById("buildDevice").style.display = 'none';
    document.getElementById("buildSellCard").style.display = 'none';
    document.getElementById("sellCardData").style.display = 'block';
    $.post('http://47.92.253.131:3389/getSellCardMsg', undefined, function(result) {
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
var showUserMsgUI = function() {
    document.getElementById("deviceData").style.display = 'none';
    document.getElementById("userData").style.display = 'block';
    document.getElementById("buildUser").style.display = 'none';
    document.getElementById("buildDevice").style.display = 'none';
    document.getElementById("buildSellCard").style.display = 'none';
    document.getElementById("sellCardData").style.display = 'none';
    if (localStorage.getItem('userType') === '1') {
        $.post('http://47.92.253.131:3389/getUserMsg', undefined, function(result) {
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
                local.userDataArr = result.dataArr;
                showUserMsg();
            }
        }, "json");
    }
};
(function() {
    showDeviceMsgUI();
})();