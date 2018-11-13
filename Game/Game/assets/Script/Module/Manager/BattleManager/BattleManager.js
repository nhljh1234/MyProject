/**
 * 战斗管理器
 */
var outModule = {};
var local = {};
var BattleFactory = require('BattleFactory');

local.timeSave = 0;
local.battleArr = [];

outModule.startBattle = function (person_1, person_2) {
    person_1.startBattleCb();
    person_2.startBattleCb();
    let battle = new BattleFactory.buildOneBattle(person_1, person_2);
    local.battleArr.push(battle);
};

outModule.timeUpdate = function (addMinutes) {
    local.timeSave = local.timeSave + addMinutes;
    if (local.timeSave >= g_GlobalData.BATTLE_TIMER_TIME) {
        local.timeSave = local.timeSave - g_GlobalData.BATTLE_TIMER_TIME;
        let newArr = [];
        local.battleArr.forEach(function (oneBattle) {
            let result = oneBattle.timeUpdate();
            if (!result) {
                //表示战斗还没有结束
                newArr.push(oneBattle);
            }
        });
        local.battleArr = newArr;
    }
};

module.exports = outModule;