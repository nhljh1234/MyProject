var getUserTrNode = function(oneData) {
    var keyArr = ['userName', 'password', 'type', 'userPos'];
    var typeStr = ['超级管理员', '客户管理员', '发货员', '设备安装员', '普通用户'];
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
        tdNode.innerText = value || '';
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
        $.post('http://47.107.49.227:3389/deleteUser', {
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
    var buildUserPos = document.getElementById("buildUserPos").value;
    var buildType = local.buildUserType;
    if (!buildName || !buildPassword || !buildUserPos ||
        (buildType !== 1 && buildType !== 2 && buildType !== 3 && buildType !== 4 && buildType !== 5)) {
        alert('参数错误');
        return;
    }
    $.post('http://47.107.49.227:3389/buildUser', {
        userName: buildName,
        password: buildPassword,
        type: buildType,
        userPos: buildUserPos
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
var showUserMsg = function(searchStr) {
    var tBodyNode = document.getElementById("tbodyUser");
    while (tBodyNode.hasChildNodes()) {
        tBodyNode.removeChild(tBodyNode.firstChild);
    }
    local.nowShowType = 'user';
    getShowDataArr(local.userDataArr, searchStr).forEach(function(oneData) {
        tBodyNode.appendChild(getUserTrNode(oneData));
    });
};
var showSelectType = function(type, selectStr) {
    local.buildUserType = type;
    document.getElementById("buildUserType").value = selectStr;
};
(function() {
    showDeviceMsgUI();
})();