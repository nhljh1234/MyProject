var outModule = {};
var local = {};

//恢复体力时间
local.recoverPowerUseTime;
//恢复一点体力需要的时间
local.onePowerRecoverUseTime;

/**
 * 获取恢复蛮体力需要的时间
 */
local.getRecoverPowerUseTime = function () {
    if (!local.recoverPowerUseTime) {
        local.recoverPowerUseTime = g_JsonDataTool.getDataById('_table_user_userParameter', 1);
    }
    if (!local.onePowerRecoverUseTime) {
        local.onePowerRecoverUseTime = g_GlobalData.MAX_POWER / local.recoverPowerUseTime;
    }
};

/**
 * 获取恢复满体力需要的时间
 * @param {BasePersonClass} userRole
 */
outModule.getRecoverPowerUseTime = function (person) {
    local.getRecoverPowerUseTime();ime;
    return Math.ceil((g_GlobalData.MAX_POWER - person._power) / local.onePowerRecoverUseTime);
};

/**
 * 使用自宅休息
 * @param {Number} restDayNum 休息时间 不传表示休息到回复蛮体力
 */
outModule.useHomeRest = function (restMinuteNum) {
    if (!restMinuteNum) {
        restMinuteNum = outModule.getRecoverPowerUseTime(g_GameGlobalManager.userRole);
    }
    let userRole = g_GameGlobalManager.userRole;
    if (userRole._power === g_GlobalData.MAX_POWER) {
        //TODO 这边要表示一下不能休息了
        return;
    }
    //设计的模式都是增加一个回调，绑定一个单独数据
    userRole._useHomeRest_data = {};
    userRole._useHomeRest_data.restMinuteNum = restMinuteNum;
    userRole._useHomeRest_data.funcIndex = userRole._updateFuncArr.length;
    //增加一个回调
    userRole._updateFuncArr.push(function (addMinute) {
        userRole._power = userRole._power + Math.ceil(addMinute / local.onePowerRecoverUseTime);
        userRole._useHomeRest_data.restMinuteNum = userRole._useHomeRest_data.restMinuteNum - addMinute;
        let finishFlag = false;
        if (userRole._useHomeRest_data.restMinuteNum <= 0) {
            finishFlag = true;
        } else if (userRole._power >= g_GlobalData.MAX_POWER) {
            finishFlag = true;
        }
        if (finishFlag) {
            //清除回调
            userRole._updateFuncArr.splice(userRole._useHomeRest_data.funcIndex, 1);
        }
        g_EventManager.send(g_EventName.USER_ROLE_STATUS_CHANGE);
    });
};

module.exports = outModule;