var local = {};
var showChangeSellCard = function(data) {
    var keyArr = ['deviceId', 'num', 'finish'];
    if (!local.buildSellCardValue) {
        local.buildSellCardValue = {};
    }
    keyArr.forEach(function(keyStr) {
        var value;
        switch (keyStr) {
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
var saveBuildSellCardValue = function(key, value, showValue) {
    if (!local.buildSellCardValue) {
        local.buildSellCardValue = {};
    }
    local.buildSellCardValue[key] = value;
    document.getElementById(key).value = showValue;
};
var getSellCardTrNode = function(oneData) {
    var keyArr = ['deviceId', 'num', 'finish'];
    var trNode = document.createElement("tr");
    keyArr.forEach(function(keyStr) {
        var value;
        switch (keyStr) {
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
var changeSellCard = function() {
    if (!local.buildSellCardValue) {
        local.buildSellCardValue = {};
    }
    $.post('http://47.92.253.131:3389/changeSellCard', {
        deviceId: document.getElementById('s_deviceId').value || 1,
        num: document.getElementById('s_num').value || 1,
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
            return oneData[nowShowDataKey[searchStrArr[0]]] == searchStrArr[1];
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
var search = function() {
    switch (local.nowShowType) {
        case 'sell_card':
            showSellCardMsg(document.getElementById('searchStr').value);
            break;
    }
};
var showBuildSellCardUI = function() {
    document.getElementById("buildSellCard").style.display = 'block';
    document.getElementById("addSellCardBtn").style.display = 'block';
    document.getElementById("changeSellCardBtn").style.display = 'none';
    document.getElementById("sellCardData").style.display = 'none';
    document.getElementById("sellCardTitle").innerHTML = "增加订单";
};
var showChangeSellCardUI = function() {
    document.getElementById("buildSellCard").style.display = 'block';
    document.getElementById("addSellCardBtn").style.display = 'none';
    document.getElementById("changeSellCardBtn").style.display = 'block';
    document.getElementById("sellCardData").style.display = 'none';
    document.getElementById("sellCardTitle").innerHTML = "修改订单";
};
var showSellCardMsgUI = function() {
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
(function() {
    showSellCardMsgUI();
})();