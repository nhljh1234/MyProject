var showBuildSellCardUI = function() {
    if (window.getComputedStyle(document.getElementById("navButton")).display !== 'none') {
        document.getElementById("navButton").click();
    }
    hideAllUI();
    document.getElementById("buildSellCard").style.display = 'block';
    document.getElementById("addSellCardBtn").style.display = 'block';
    document.getElementById("sellCardTitle").innerHTML = "增加订单";
};

var showChangeSellCardUI = function() {
    hideAllUI();
    document.getElementById("buildSellCard").style.display = 'block';
    document.getElementById("changeSellCardBtn").style.display = 'block';
    document.getElementById("sellCardTitle").innerHTML = "修改订单";
};

var showBuildDeviceUI = function() {
    if (window.getComputedStyle(document.getElementById("navButton")).display !== 'none') {
        document.getElementById("navButton").click();
    }
    hideAllUI();
    document.getElementById("buildDevice").style.display = 'block';
    document.getElementById("deviceTitle").innerHTML = "增加设备";
};

var showDeviceChangeUI = function() {
    hideAllUI();
    document.getElementById("changeDevice").style.display = 'block';
    document.getElementById("deviceTitle").innerHTML = "修改设备";
    showChangeDeviceMsg();
};

var showBuildUserUI = function() {
    if (window.getComputedStyle(document.getElementById("navButton")).display !== 'none') {
        document.getElementById("navButton").click();
    }
    hideAllUI();
    document.getElementById("buildUser").style.display = 'block';
};

var showDeviceMsgUI = function(isInit) {
    if (isInit === false) {
        if (window.getComputedStyle(document.getElementById("navButton")).display !== 'none') {
            document.getElementById("navButton").click();
        }
    }
    hideAllUI();
    document.getElementById("deviceData").style.display = 'block';
    $.post('http://localhost:8888/getDeviceMsg', {
        page: 1
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
        if (result.dataArr) {
            local.deviceDataArr = result.dataArr;
            showDeviceMsg();
        }
    }, "json");
};

var showSellCardMsgUI = function() {
    if (window.getComputedStyle(document.getElementById("navButton")).display !== 'none') {
        document.getElementById("navButton").click();
    }
    hideAllUI();
    document.getElementById("sellCardData").style.display = 'block';
    $.post('http://localhost:8888/getSellCardMsg', {
        page: 1
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
        if (result.dataArr) {
            local.sellDataArr = result.dataArr;
            showSellCardMsg();
        }
    }, "json");
};

var showUserMsgUI = function() {
    if (window.getComputedStyle(document.getElementById("navButton")).display !== 'none') {
        document.getElementById("navButton").click();
    }
    hideAllUI();
    document.getElementById("userData").style.display = 'block';
    if (localStorage.getItem('userType') === '1') {
        $.post('http://localhost:8888/getUserMsg', {
            page: 1
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
            if (result.dataArr) {
                local.userDataArr = result.dataArr;
                showUserMsg();
            }
        }, "json");
    }
};

var showDeviceDetailMsgUI = function() {
    hideAllUI();
    document.getElementById("showDeviceData").style.display = 'block';
    showDeviceDetailMsg();
};

var hideAllUI = function() {
    document.getElementById("deviceData") && (document.getElementById("deviceData").style.display = 'none');
    document.getElementById("showDeviceData") && (document.getElementById("showDeviceData").style.display = 'none');
    document.getElementById("changeDeviceBtn") && (document.getElementById("changeDeviceBtn").style.display = 'none');
    document.getElementById("userData") && (document.getElementById("userData").style.display = 'none');
    document.getElementById("buildUser") && (document.getElementById("buildUser").style.display = 'none');
    document.getElementById("buildDevice") && (document.getElementById("buildDevice").style.display = 'none');
    document.getElementById("changeDevice") && (document.getElementById("changeDevice").style.display = 'none');
    document.getElementById("buildSellCard") && (document.getElementById("buildSellCard").style.display = 'none');
    document.getElementById("sellCardData") && (document.getElementById("sellCardData").style.display = 'none');
    document.getElementById("addSellCardBtn") && (document.getElementById("addSellCardBtn").style.display = 'none');
    document.getElementById("changeSellCardBtn") && (document.getElementById("changeSellCardBtn").style.display = 'none');
};