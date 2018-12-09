var login = function() {
    var userName = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    if (!userName || !password) {
        return;
    }
    $.post('http://47.107.49.227:3389/checkUser', {
        userName: userName,
        password: password
    }, function(result) {
        if (result.errorStr) {
            alert(result.errorStr);
            return;
        }
        if (result.ret !== 1) {
            return;
        }
        localStorage.setItem('userType', result.userType);
        window.location.href = 'html_' + result.userType + '.html';
    }, "json");
};

(function() {

})();