var login = function () {
    var checkFlag = document.getElementById("checkBox").checked;
    var num = document.getElementById("inputNum").value;
    if (!num || !num.length) {
        return;
    }
    localStorage.setItem('_device_num_temporary', num);
    if (checkFlag) {
        localStorage.setItem('_device_num', num);
    } else {
        localStorage.removeItem('_device_num');
    }
    //跳转
    window.location.href = 'html.html';
};

(function () {
    document.getElementById("inputNum").value = localStorage.getItem('_device_num');
    document.getElementById("checkBox").checked = localStorage.getItem('_device_num') ? true : false;
})();