/*global module, require, cc, client */
/**
 * @desc 战斗模块，一次战斗就初始化一个
 * @author Administrator
 */
var BattleControl = require('BattleControl');

var outModule = {};
var local = {};

//缓存己方队伍
local.soldiers = undefined;
//缓存敌方队伍
local.enemies = undefined;

//是否自动战斗
local.isAutomatic = undefined;

//开始一场战役
/**
 *
 * @param soldiers
 * @param enemies
 * @param isAutomatic
 */
outModule.startOneBattle = (component, soldiers, enemies, isAutomatic) => {
    local.soldiers = soldiers;
    local.enemies = enemies;
    //自动战斗
    local.isAutomatic = isAutomatic;
    //初始化战斗控制器
    BattleControl.init(local.soldiers, local.enemies, component);
};

module.exports = outModule;

