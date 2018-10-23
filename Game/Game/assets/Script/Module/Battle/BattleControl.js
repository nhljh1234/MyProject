/*global module, require, cc, client */
/**
 * @desc 模块描述
 * @author Administrator
 */
var outModule = {};
var local = {};

//承载定时器
local.component = undefined;

//己方队员
local.soilders = undefined;
//地方
local.enemies = undefined;

//定时函数
local.update = () => {
    //每个己方英雄技能执行update
    local.soilders._b_skillArr.forEach(function (oneSkill) {
        oneSkill.update(g_BATTLE_TIMER_TIME);
    });
    //每个敌方英雄技能执行update
    local.enemies._b_skillArr.forEach(function (oneSkill) {
        oneSkill.update(g_BATTLE_TIMER_TIME);
    });
};

//技能控制初始化
outModule.init = (soilders, enemies, component) => {
    local.component = component;
    local.soilders = soilders;
    local.enemies = enemies;
};

//开始计时器
outModule.start = () => {
    local.component.schedule(local.update, g_BATTLE_TIMER_TIME, cc.macro.REPEAT_FOREVER);
};

outModule.stop = () => {

};

module.exports = outModule;
