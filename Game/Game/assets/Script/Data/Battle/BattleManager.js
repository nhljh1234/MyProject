/*global module, require, cc, client */
/**
 * @desc 战斗模块，一次战斗就初始化一个
 * @author Administrator
 */
var BattleControl = require('BattleControl');

var outModule = {};
var local = {};

//缓存己方队伍
outModule.soldiers = undefined;
//缓存敌方队伍
outModule.enemies = undefined;

//是否自动战斗
local.isAutomatic = undefined;

//开始一场战役
/**
 *
 * @param soldiers
 * @param enemies
 * @param isAutomatic
 */
outModule.init = (soldiers, enemies, isAutomatic) => {
    outModule.soldiers = soldiers;
    outModule.enemies = enemies;
    //自动战斗
    local.isAutomatic = isAutomatic;
};

//初始化场景组建
outModule.startBattle = (component) => {
    //初始化战斗控制器
    BattleControl.init(component);
    BattleControl.updateData(outModule.soldiers, outModule.enemies);
};

//清除死亡角色
outModule.clearDead = () => {
    let soldiers = [], enemies = [];
    outModule.soldiers.forEach(function (soldier) {
        if (!soldier._b_isDead) {
            soldiers.push(soldier);
        }
    });
    outModule.enemies.forEach(function (enemy) {
        if (!enemy._b_isDead) {
            enemies.push(enemy);
        }
    });
    outModule.soldiers = soldiers;
    outModule.enemies = enemies;
    BattleControl.updateData(outModule.soldiers, outModule.enemies);
    if (outModule.soldiers.length === 0 || outModule.enemies.length === 0) {
        BattleControl.stop();
    }
};

module.exports = outModule;

