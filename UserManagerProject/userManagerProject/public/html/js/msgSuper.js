var getTrNode = function(oneData) {
    const keyArr = ['deviceId', 'PM25', 'PM25_C', 'PM10', 'PM10_C', 'noise', 'noise_C', 'temperature', 'temperature_C', 'humidity', 'humidity_C',
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
    return trNode;
};
var showMsg = function(dataArr) {
    var tBodyNode = document.getElementById("tbody");
    while (tBodyNode.hasChildNodes()) {
        tBodyNode.removeChild(tBodyNode.firstChild);
    }
    dataArr.forEach(function(oneData) {
        tBodyNode.appendChild(getTrNode(oneData));
    });
};
(function() {
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
            showMsg(result.dataArr);
        }
    }, "json");
})();