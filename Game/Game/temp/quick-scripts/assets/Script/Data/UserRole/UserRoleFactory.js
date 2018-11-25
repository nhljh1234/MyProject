(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Data/UserRole/UserRoleFactory.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8d819rTx4JDKbQ5M0RJkmBL', 'UserRoleFactory', __filename);
// Script/Data/UserRole/UserRoleFactory.js

'use strict';

var outModule = {};
var local = {};
var RandomNameTool = require('RandomNameTool');

/**
 * 绑定函数
 */
local.buildFunc = function (userRole) {
    //获取存储的数据
    userRole.getSaveData = function () {};
};

/**
 * 新建一个主角数据
 * 会有一个随机主角属性的功能
 */
local.createUserRole = function (randomData) {
    //名字
    this._name = randomData.name;
    //攻击力
    this._attack = randomData.attack;
    //防御力
    this._def = randomData.def;
    //统帅
    this._command = randomData.command;
    //智力
    this._intelligence = randomData.intelligence;
    //魅力
    this._charm = randomData.charm;
    //政治
    this._politics = randomData.politics;
    //生命值
    this._maxHp = randomData.hp;
    //性别
    this._sex = randomData.sex;
    //大地图移动速度
    this._moveSpeed = randomData.moveSpeed;
    //个人技能
    this._presonSkillId = randomData.presonSkillId || 1;
    //TODO 需要新建一个技能

    //战争技能
    this._battleSkillId = randomData.battleSkillId || 1;
    //TODO 需要新建一个技能 

    //这边是存储的配置
    //武器装备
    this._equipAttack = undefined;
    //防御装备
    this._equipDef = undefined;
    //首饰
    this._equipJewelry = undefined;
    //坐骑
    this._equipHorse = undefined;
    //血量
    this._nowHp = this._maxHp;
    //唯一id
    this._id = g_GameGlobalManager.getNewPersonId();
    //位置
    //初始都是在家的
    this._pos = {
        cityId: g_JsonDataTool.getDataById('_table_Game_userRandomData', 1).num || 1,
        buildingId: -1
    };
    //家的位置，是一个城市id
    this._homePos = this._pos.cityId;
    //目的地的大地图坐标
    this._goalCityMapPos = undefined;
    //当前人物所在的大地图坐标
    this._nowMapPos = undefined;
    //目标城市的id
    this._goalCityId = undefined;
    //当前执行的任务
    this._nowAction = undefined;
    //当前的人物的物品数据
    this._itemArr = [];
    //货币数量
    //初始的时候给玩家一点
    this._money = g_JsonDataTool.getDataById('_table_Game_userRandomData', 9).num;
    //体力
    this._power = g_GlobalData.MAX_POWER;
    //标记物品id的最大值
    this._maxItemId = 1;
    //是否在战斗中
    //暂定是不记录战斗信息
    this._inInBattle = false;
    //回调列表
    //这么设计是主角比较特殊，可能存在多个要处理的状态，标记太多不好
    //比如在自宅休息的时候会存入一个回调，每次调用的时候更新人物的体力和生命值
    this._updateFuncArr = [];

    local.buildFunc(this);
};

/**
 * 根据存储的数据新建一个主角数据
 */
local.createUserRoleBySaveData = function (saveData) {};

/**
 * 获取一个玩家角色的随机数据
 * 性别和名字需要外部传入一个确定值
 */
outModule.getRandomUserRoleData = function (sex, name) {
    var randomData = {};
    randomData.sex = sex || g_GlobalData.SEX_MAN;
    randomData.name = name || RandomNameTool.getRandomName(randomData.sex);
    //随机数据
    randomData.attack = g_JsonDataTool.getDataById('_table_Game_userRandomData', 2).num + Math.ceil(cc.random0To1() * (100 - g_JsonDataTool.getDataById('_table_Game_userRandomData', 2).num));
    randomData.def = g_JsonDataTool.getDataById('_table_Game_userRandomData', 3).num + Math.ceil(cc.random0To1() * (100 - g_JsonDataTool.getDataById('_table_Game_userRandomData', 3).num));
    randomData.command = g_JsonDataTool.getDataById('_table_Game_userRandomData', 4).num + Math.ceil(cc.random0To1() * (100 - g_JsonDataTool.getDataById('_table_Game_userRandomData', 4).num));
    randomData.intelligence = g_JsonDataTool.getDataById('_table_Game_userRandomData', 5).num + Math.ceil(cc.random0To1() * (100 - g_JsonDataTool.getDataById('_table_Game_userRandomData', 5).num));
    randomData.charm = g_JsonDataTool.getDataById('_table_Game_userRandomData', 6).num + Math.ceil(cc.random0To1() * (100 - g_JsonDataTool.getDataById('_table_Game_userRandomData', 6).num));
    randomData.politics = g_JsonDataTool.getDataById('_table_Game_userRandomData', 7).num + Math.ceil(cc.random0To1() * (100 - g_JsonDataTool.getDataById('_table_Game_userRandomData', 7).num));
    randomData.hp = g_JsonDataTool.getDataById('_table_Game_userRandomData', 8).num + Math.ceil(cc.random0To1() * (1000 - g_JsonDataTool.getDataById('_table_Game_userRandomData', 8).num));
    randomData.moveSpeed = 5;
    return randomData;
};

outModule.createUserRole = function (saveData, randomData) {
    if (saveData) {
        return new local.createUserRoleBySaveData(saveData);
    }
    return new local.createUserRole(randomData || outModule.getRandomUserRoleData());
};

module.exports = outModule;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=UserRoleFactory.js.map
        