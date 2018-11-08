var showData_1 = {};
var showData_2 = {};
var showData = {};
var questNum = 0;
var deviceId;
var wordChange = {
    Deviceid: "设备id",
    DataTime: "请求时间",
    PM25: "PM25",
    PM10: "PM10",
    TSP: "TSP",
    B03: "噪音",
    W01: "风向",
    W02: "风速",
    T01: "温度",
    H01: "湿度",
    O3: "臭氧",
    CreatedAt: "创建时间",
    Modified: "最新修改时间",
    Pm25SprayState: "PM25请求状态",
    Pm10SprayState: "PM10请求状态",
    TspSprayState: "TSP请求状态",
    PM25LowValue: "PM25低值",
    PM25UpValue: "PM25高值",
    PM10LowValue: "PM10低值",
    PM10UpValue: "PM10高值"
};
var getTrNode = function (key, value) {
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

var updateUI = function () {
    showData = {};
    var key;
    //保证顺序
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
    var tBodyNode = document.getElementById("tbody");
    for (key in showData) {
        if (!showData.hasOwnProperty(key)) {
            continue;
        }
        var showStr = showData[key];
        switch (key) {
            case 'PM25':
            case 'PM10':
            case 'TSP':
            case 'B03':
            case 'W01':
            case 'W02':
            case 'T01':
            case 'H01':
                showStr = parseInt(showStr) / 10;
                break;
            case 'O3':
                showStr = parseInt(showStr) / 100 + 'ppm';
                break;
        }
        tBodyNode.appendChild(getTrNode(wordChange[key] || key, showStr));
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
    $("#dir").bootstrapSwitch('setState', SensorArr[4]);
    $("#speed").bootstrapSwitch('setState', SensorArr[5]);
    $("#O3").bootstrapSwitch('setState', SensorArr[8]);
};

var setData = function () {
    deviceId = deviceId || localStorage.getItem('_device_num_temporary') || localStorage.getItem('_device_num');
    if (!deviceId) {
        alert("未输入设备号");
        window.location.href = 'login.html';
    }
    SensorArr[4] = $("#dir").bootstrapSwitch('status');
    SensorArr[5] = $("#speed").bootstrapSwitch('status');
    SensorArr[8] = $("#O3").bootstrapSwitch('status');
    var sensorNum = 0;
    var startNum = 1;
    for (var i = 0; i < SensorArr.length;i++) {
        sensorNum = sensorNum + (SensorArr[i] ? 1 : 0) * startNum;
        startNum = startNum * 2;
    }
    localStorage.removeItem('_device_num_temporary');
    $.post("http://xmenvi.wujjc.com:2008/envi/device_cfg", JSON.stringify({
        device: deviceId,
        allcfg: "sensor_enable=" + sensorNum + ";"
    }), function (result) {
        if (result.code === 0) {
            alert("设置成功");
            window.location.reload(true);
        }
    }, "json");
};

var SensorArr = [false, false, false, false, false, false, false, false, false, false, false, false, false];
var getSensorData = function (CPData) {
    var arr = CPData.split(";");
    var SensorStr;
    arr.forEach(function (str) {
        var strArr = str.split("=");
        if (strArr[0] === "sensor_enable") {
            SensorStr = strArr[1];
        }
    });
    if (SensorStr) {
        var startNum = Math.pow(2, SensorArr.length - 1);
        var SensorNum = parseInt(SensorStr);
        for (var i = SensorArr.length - 1; i >= 0; i--) {
            if (SensorNum >= startNum) {
                SensorNum = SensorNum - startNum;
                SensorArr[i] = true;
            }
            startNum = startNum / 2;
        }
    }
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
            showData_1[key] = deviceData[key];
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
            showData_2[key] = deviceData[key];
        }
        questNum++;
        if (questNum === 2) {
            updateUI();
        }
    });
})();