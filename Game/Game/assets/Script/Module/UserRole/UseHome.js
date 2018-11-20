var outModule = {};

/**
 * 使用自宅休息
 * @param restDayNum 休息时间 不传表示休息到回复蛮体力和hp
 */
outModule.useHomeRest = function (restDayNum) {
    let userRole = g_GameGlobalManager.userRole;
    if (userRole._nowHp === userRole._maxHp && userRole._power === g_GlobalData.MAX_POWER) {
        //TODO 这边要表示一下不能休息了
        return;
    }
    //设计的模式都是增加一个回调，绑定一个单独数据
    userRole._useHomeRest_data = {};
    userRole._useHomeRest_data.restDayNum = restDayNum;

};

module.exports = outModule;