function OnClick() {
    var strNow = this.document.getElementById("now").value;
    var strBuild = this.document.getElementById("build").value;

    var strs = strNow.split("\n");

    for (var i = 0; i < strs.length; i++) {
        var attrs = strs[i].split("=");
        if (attrs.length > 1) {
            if (attrs[1].indexOf('dp"') >= 0) {
                strs[i] = attrs[0] + "=" + changeSize(attrs[1], "dp");
            } else if (attrs[1].indexOf('sp"') >= 0) {
                strs[i] = attrs[0] + "=" + changeSize(attrs[1], "sp");
            }
        }
    }

    var strResult = "";
    for (var i = 0; i < strs.length; i++) {
        strResult = strResult + strs[i];
        if (i != strs.length - 1) {
            strResult = strResult + "\n";
        }
    }
    this.document.getElementById("build").value = strResult;
}

function changeSize(str, replaceStr) {
    var newDPI = this.document.getElementById("newDPI").value;
    newDPI = Number(newDPI);

    str = str.replace('"', "");

    var attrs = str.split(replaceStr);

    var number = Number(attrs[0]);
    number = Math.floor(420 / newDPI * number + 0.5);
    return '"' + number + replaceStr + attrs[1];
}