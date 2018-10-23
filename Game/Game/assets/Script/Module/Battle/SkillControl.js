/*global module, require, cc, client */
/**
 * @desc 技能控制处理
 * @author Administrator
 */
require('Game');
var BattleManager = require("BattleManager");
var outModule = {};
var local = {};

//所有的技能数据
local.judgeFuncObj = {};
local.judgeFuncObj[g_AUTOMATIC_TYPE_OBJ.TYPE_1] = function (skillData) {
    return true;
};

/**
 * 判断是否要使用技能
 * @param skillData 技能工厂中输出的数据
 */
outModule.judgeUseSkill = function (skillData) {
    return local.judgeFuncObj[skillData._automaticType](skillData);
};

module.exports = outModule;
