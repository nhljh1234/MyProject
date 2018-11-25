var local = {};

var getShowDataArr = function(dataArr, searchStr) {
    if (!searchStr) {
        return dataArr;
    }
    return dataArr.filter(function(oneData) {
        for (var key in oneData) {
            if (!oneData.hasOwnProperty(key)) {
                continue;
            }
            if (oneData[key].indexOf(searchStr) >= 0) {
                return true;
            }
        }
        return false;
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
        case 'user':
            showUserMsg(document.getElementById('searchStr').value);
            break;
    }
};