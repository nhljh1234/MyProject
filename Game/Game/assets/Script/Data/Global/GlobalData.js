/**
 * 定义了所有的常量
 */
var outModule = {};
var local = {};

outModule.SEX_MAN = 1;
outModule.SEX_WOMAN = 2;

outModule.init = function () {
    //大地图随机事件几率
    outModule.MAP_RANDOM_EVENT_RECORD = g_JsonDataTool.getDataById('_table_Game_gameParameter', 1).num;
    //最大体力值
    outModule.MAX_POWER = g_JsonDataTool.getDataById('_table_Game_gameParameter', 2).num;
    //背包最大数量
    outModule.MAX_ITEM_NUM = g_JsonDataTool.getDataById('_table_Game_gameParameter', 3).num;
    //体力最小值，低于这个体力会自动去吃药或者医馆
    outModule.MIN_POWER_NUM = g_JsonDataTool.getDataById('_table_Game_gameParameter', 4).num;
    //自动战斗间隔
    //单位分钟
    outModule.BATTLE_TIMER_TIME = g_JsonDataTool.getDataById('_table_Game_gameParameter', 5).num;
};

module.exports = outModule;