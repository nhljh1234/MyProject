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
local.heroes = undefined;
//地方
local.enemies = undefined;

//全局的暂停按钮
local.pauseFlag = false;

//定时函数
local.update = () => {
    if (local.pauseFlag) {
        return;
    }
    //每个己方英雄技能执行update
    local.heroes.forEach(function (oneHero) {
        //英雄执行update
        oneHero.update(g_BATTLE_TIMER_TIME);
        oneHero._b_skillArr.forEach(function (oneSkill) {
            oneSkill.update(g_BATTLE_TIMER_TIME, oneHero);
        });
    });
    //每个敌方英雄技能执行update
    local.enemies.forEach(function (oneEnemy) {
        //地方执行update
        oneEnemy.update(g_BATTLE_TIMER_TIME);
        oneEnemy._b_skillArr.forEach(function (oneSkill) {
            oneSkill.update(g_BATTLE_TIMER_TIME, oneEnemy);
        });
    });
};

//技能控制初始化
outModule.init = (component) => {
    local.component = component;
};

outModule.updateData = (heroes, enemies) => {
    local.heroes = heroes;
    local.enemies = enemies;
};

//暂停战斗
outModule.pause = () => {
    if (local.pauseFlag) {
        return;
    }
    local.pauseFlag = true;
    //每个己方英雄技能执行pause
    local.heroes.forEach(function (hero) {
        hero.pause();
    });
    //每个敌方英雄技能执行pause
    local.enemies.forEach(function (enemy) {
        enemy.pause();
    });
};

//取消暂停
outModule.resume = () => {
    if (!local.pauseFlag) {
        return;
    }
    local.pauseFlag = false;
    //每个己方英雄技能执行resume
    local.heroes.forEach(function (hero) {
        hero.resume();
    });
    //每个敌方英雄技能执行resume
    local.enemies.forEach(function (enemy) {
        enemy.resume();
    });
};

//开始计时器
outModule.start = () => {
    local.component.schedule(local.update, g_BATTLE_TIMER_TIME, cc.macro.REPEAT_FOREVER);
    //每个己方英雄技能执行start
    local.heroes.forEach(function (hero) {
        hero.start();
    });
    //每个敌方英雄技能执行start
    local.enemies.forEach(function (enemy) {
        enemy.start();
    });
};

outModule.stop = () => {
    local.component.unschedule(local.update);
    //每个己方英雄技能执行stop
    local.heroes.forEach(function (hero) {
        hero.stop();
    });
    //每个敌方英雄技能执行stop
    local.enemies.forEach(function (enemy) {
        enemy.stop();
    });
};

module.exports = outModule;
