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
        $.post('http://localhost:8888/deleteUser', {
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
    $.post('http://localhost:8888/buildUser', {
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
var showDeviceMsg = function(askKey, askValue) {
    var tBodyNode = document.getElementById("tbodyDevice");
    while (tBodyNode.hasChildNodes()) {
        tBodyNode.removeChild(tBodyNode.firstChild);
    }
    local.deviceDataArr.forEach(function(oneData) {
        tBodyNode.appendChild(getDeviceTrNode(oneData));
    });
};
var showUserMsg = function(askKey, askValue) {
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
var showBuildUserUI = function() {
    document.getElementById("deviceData").style.display = 'none';
    document.getElementById("userData").style.display = 'none';
    document.getElementById("buildUser").style.display = 'block';
};
var showDeviceMsgUI = function() {
    document.getElementById("deviceData").style.display = 'block';
    document.getElementById("userData").style.display = 'none';
    document.getElementById("buildUser").style.display = 'none';
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
            showDeviceMsg();
        }
    }, "json");
};
var showUserMsgUI = function() {
    document.getElementById("deviceData").style.display = 'none';
    document.getElementById("userData").style.display = 'block';
    document.getElementById("buildUser").style.display = 'none';
    if (localStorage.getItem('userType') === '1') {
        $.post('http://localhost:8888/getUserMsg', undefined, function(result) {
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