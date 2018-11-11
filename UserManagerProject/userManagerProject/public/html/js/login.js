var login = function() {
    var userName = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    if (!userName || !password) {
        return;
    }
    $.post('http://localhost:8888/checkUser', {
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
        switch (result.userType) {
            case 1:
                window.location.href = 'html_1.html';
                braek;
            case 2:
                braek;
            case 3:
                braek;
        }
    }, "json");
};

(function() {

})();