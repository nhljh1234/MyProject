var outModule = {};
var local = {};
var FileSaveTool = require('../../../FileSaveTool/FileSaveTool');
var GlobalData = require('../../../GlobalData');

outModule.getUserMsg = (req, res) => {
    //判断session
    if (!req.session || !req.session.userData) {
        res.send(JSON.stringify({
            ret: -2,
            errorStr: '请登录'
        }));
        res.end();
        return;
    }
    if (req.session.userData.type !== GlobalData.USER_TYPE_SUPER) {
        res.send(JSON.stringify({
            ret: -1,
            errorStr: '没有权限'
        }));
        res.end();
        return;
    }
    FileSaveTool.getJsonData(GlobalData.USER_SAVE_JSON_FILE_NAME, function() {
        let userJsonData = FileSaveTool.getLocalSaveData(GlobalData.USER_SAVE_JSON_FILE_NAME);
        let allUserArr = [];
        for (var key in userJsonData) {
            if (!userJsonData.hasOwnProperty(key)) {
                continue;
            }
            allUserArr.push(userJsonData[key]);
        }
        res.send(JSON.stringify({
            ret: 1,
            dataArr: allUserArr
        }));
        res.end();
    }, undefined);
};

module.exports = outModule;