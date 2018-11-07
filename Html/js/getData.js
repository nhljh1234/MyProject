var showData = {};
var questNum = 0;
var deviceId;
var getTrNode = function (key, value) {
    var trNode = document.createElement("tr");
    var tdKeyNode = document.createElement("td");
    var tdValueNode = document.createElement("td");
    tdKeyNode.width = "100px";
    tdKeyNode.innerText = key;
    tdValueNode.innerText = value;
    tdValueNode.style = "word-break:break-all; word-wrap:break-all;";
    trNode.appendChild(tdKeyNode);
    trNode.appendChild(tdValueNode);
    return trNode;
};

var updateUI = function () {
    var tBodyNode = document.getElementById("tbody");
    for (var key in showData) {
        if (!showData.hasOwnProperty(key)) {
            continue;
        }
        tBodyNode.appendChild(getTrNode(key, showData[key]));
    }
};

var showDeviceDataUI = function () {
    document.getElementById("showData").style.display = 'block';
    document.getElementById("setData").style.display = 'none';
    document.getElementById("navButton").click();
};

var showSetDeviceDataUI = function () {
    document.getElementById("showData").style.display = 'none';
    document.getElementById("setData").style.display = 'block';
    document.getElementById("navButton").click();
};

var setData = function () {
    deviceId = deviceId || localStorage.getItem('_device_num_temporary') || localStorage.getItem('_device_num');
    if (!deviceId) {
        alert("未输入设备号");
        window.location.href = 'login.html';
    }
    localStorage.removeItem('_device_num_temporary');
    $.post("http://xmenvi.wujjc.com:2008/envi/device_cfg", {
        device: deviceId
    }, function (result) {
        alert(result);
    });
};

(function () {
    document.getElementById("showData").style.display = 'block';
    document.getElementById("setData").style.display = 'none';
    deviceId = deviceId || localStorage.getItem('_device_num_temporary') || localStorage.getItem('_device_num');
    showData = {};
    questNum = 0;
    if (!deviceId) {
        alert("未输入设备号");
        window.location.href = 'login.html';
    }
    localStorage.removeItem('_device_num_temporary');
    $.get("http://xmenvi.wujjc.com:2008/envi/device_wd/real?device=" + deviceId, function (result) {
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
            showData[key] = deviceData[key];
        }
        questNum++;
        if (questNum === 2) {
            updateUI();
        }
    });
    $.get("http://xmenvi.wujjc.com:2008/envi/device_cfg/real/" + deviceId, function (result) {
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
            showData[key] = deviceData[key];
        }
        questNum++;
        if (questNum === 2) {
            updateUI();
        }
    });
})();