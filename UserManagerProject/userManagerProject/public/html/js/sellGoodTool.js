var showSellCardMsg = function(searchStr) {
    var tBodyNode = document.getElementById("tbodySellCard");
    while (tBodyNode.hasChildNodes()) {
        tBodyNode.removeChild(tBodyNode.firstChild);
    }
    local.nowShowType = 'sell_card';
    getShowDataArr(local.sellDataArr, searchStr).forEach(function(oneData) {
        tBodyNode.appendChild(getSellCardTrNode(oneData));
    });
};
var changeSellCard = function() {
    if (!local.buildSellCardValue) {
        local.buildSellCardValue = {};
    }
    $.post('http://localhost:8888/changeSellCard', {
        deviceId: document.getElementById('s_deviceId').value || 1,
        num: document.getElementById('s_num').value || 1,
        customerName: document.getElementById('s_customer_name') ? document.getElementById('s_customer_name').value : '空',
        customerPos: document.getElementById('s_customer_pos').value || '空',
        customerPhone: document.getElementById('s_customer_phone') ? document.getElementById('s_customer_phone').value : '空',
        customerArea: document.getElementById('s_customer_area').value || '空',
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
        customerName: document.getElementById('s_customer_name') ? document.getElementById('s_customer_name').value : '空',
        customerPos: document.getElementById('s_customer_pos').value || '空',
        customerPhone: document.getElementById('s_customer_phone') ? document.getElementById('s_customer_phone').value : '空',
        customerArea: document.getElementById('s_customer_area').value || '空',
        canRead: local.buildSellCardValue['s_can_read'] || 1,
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

var getSellCardTrNode = function(oneData) {
    var keyArr = [];
    var valueArr = [];
    if (localStorage.getItem('userType') === '1') {
        keyArr = ['deviceId', 'num', 'customer_name', 'customer_pos', 'customer_phone', 'customer_area', 'can_read', 'finish'];
        valueArr = ['deviceId', 'num', 'customerName', 'customerPos', 'customerPhone', 'customerArea', 'canRead', 'finish'];
    } else if ((localStorage.getItem('userType') === '2')) {
        keyArr = ['deviceId', 'num', 'customer_pos', 'customer_area', 'can_read', 'finish'];
        valueArr = ['deviceId', 'num', 'customerPos', 'customerArea', 'canRead', 'finish'];
    } else if ((localStorage.getItem('userType') === '3')) {
        keyArr = ['deviceId', 'num', 'customer_pos', 'customer_area', 'finish'];
        valueArr = ['deviceId', 'num', 'customerPos', 'customerArea', 'finish'];
    }
    var trNode = document.createElement("tr");
    keyArr.forEach(function(keyStr, index) {
        var value;
        switch (keyStr) {
            case 'can_read':
            case 'finish':
                value = oneData[valueArr[index]] ? '是' : '否';
                break;
            default:
                value = oneData[valueArr[index]];
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

var saveBuildSellCardValue = function(key, value, showValue) {
    if (!local.buildSellCardValue) {
        local.buildSellCardValue = {};
    }
    local.buildSellCardValue[key] = value;
    document.getElementById(key).value = showValue;
};

var showChangeSellCard = function(data) {
    var keyArr = [];
    var valueArr = [];
    if (localStorage.getItem('userType') === '1') {
        keyArr = ['deviceId', 'num', 'customer_name', 'customer_pos', 'customer_phone', 'customer_area', 'can_read', 'finish'];
        valueArr = ['deviceId', 'num', 'customerName', 'customerPos', 'customerPhone', 'customerArea', 'canRead', 'finish'];
    } else if ((localStorage.getItem('userType') === '2')) {
        keyArr = ['deviceId', 'num', 'customer_pos', 'customer_area', 'can_read', 'finish'];
        valueArr = ['deviceId', 'num', 'customerPos', 'customerArea', 'canRead', 'finish'];
    } else if ((localStorage.getItem('userType') === '3')) {
        keyArr = ['deviceId', 'num', 'customer_pos', 'customer_area', 'finish'];
        valueArr = ['deviceId', 'num', 'customerPos', 'customerArea', 'finish'];
    }
    if (!local.buildSellCardValue) {
        local.buildSellCardValue = {};
    }
    keyArr.forEach(function(keyStr, index) {
        var value;
        switch (keyStr) {
            case 'can_read':
            case 'finish':
                local.buildSellCardValue['s_' + keyStr] = data[valueArr[index]];
                value = data[valueArr[index]] ? '是' : '否';
                break;
            default:
                value = data[valueArr[index]];
                break;
        }
        document.getElementById('s_' + keyStr).value = value;
    });
};