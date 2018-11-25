(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Data/Person/PersonFactory.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'df57fUKMbtEoIoqbtWvxhF/', 'PersonFactory', __filename);
// Script/Data/Person/PersonFactory.js

'use strict';

/*global module, require, cc, client */
var outModule = {};
var local = {};
var RandomNameTool = require('RandomNameTool');
var ActionFactory = require('ActionFactory');
var SellGoodFactory = require('SellGoodFactory');
var MapRandomEvent = require('MapRandomEvent');

/**
 * 改变人物大地图上的位置
 */
local.changeMapPos = function (person, addMinutes) {
    if (!person._goalCityMapPos) {
        return;
    }
    if (!g_GameTool.judgeEqualPos(person._nowMapPos, person._goalCityMapPos)) {
        //还没有到达目的地
        if (MapRandomEvent.judgeMapRandomEvent(person)) {
            return;
        }
        //移动的距离
        var moveNum = Math.ceil(addMinutes / 10 * person._moveSpeed);
        //这边暂时不使用三角函数计算，减少计算量
        var disX = Math.abs(person._goalCityMapPos.x - person._nowMapPos.x);
        var disY = Math.abs(person._goalCityMapPos.y - person._nowMapPos.y);
        var addX = disX / (disX + disY) * moveNum;
        var addY = disY / (disX + disY) * moveNum;
        //x距离增加
        if (person._goalCityMapPos.x !== person._nowMapPos.x) {
            if (person._goalCityMapPos.x > person._nowMapPos.x) {
                person._nowMapPos.x = person._nowMapPos.x + addX;
                if (person._nowMapPos.x >= person._goalCityMapPos.x) {
                    person._nowMapPos.x = person._goalCityMapPos.x;
                }
            } else {
                person._nowMapPos.x = person._nowMapPos.x - addX;
                if (person._nowMapPos.x <= person._goalCityMapPos.x) {
                    person._nowMapPos.x = person._goalCityMapPos.x;
                }
            }
        }
        //y距离增加
        if (person._goalCityMapPos.y !== person._nowMapPos.y) {
            if (person._goalCityMapPos.y > person._nowMapPos.y) {
                person._nowMapPos.y = person._nowMapPos.x + addY;
                if (person._nowMapPos.y >= person._goalCityMapPos.y) {
                    person._nowMapPos.y = person._goalCityMapPos.y;
                }
            } else {
                person._nowMapPos.y = person._nowMapPos.y - addY;
                if (person._nowMapPos.y <= person._goalCityMapPos.y) {
                    person._nowMapPos.y = person._goalCityMapPos.y;
                }
            }
        }
        if (g_GameTool.judgeEqualPos(person._nowMapPos, person._goalCityMapPos)) {
            person._pos.cityId = person._goalCityId;
            person._nowMapPos = person._goalCityMapPos;
            person._goalCityMapPos = undefined;
            person._goalCityId = undefined;
        }
    }
};

/**
 * 没有任务的时候会去判断下一步应该执行什么任务
 */
local.judgeNextAction = function (person) {
    if (person._itemArr.length > g_GlobalData.MAX_ITEM_NUM) {
        return ActionFactory.createOneAction(5);
    }
    if (person._power < g_GlobalData.MAX_POWER / 2) {
        //睡觉
        return cc.random0To1() < 0.5 ? ActionFactory.createOneAction(3) : ActionFactory.createOneAction(4);
    } else {
        return cc.random0To1() < 0.5 ? ActionFactory.createOneAction(1) : ActionFactory.createOneAction(2);
    }
};

/**
 * @param person 已经加好数据的人物，再增加一些操作函数
 */
local.buildFunc = function (person) {
    //前往一个地点
    person.goToCity = function (cityId) {
        if (person._inInBattle) {
            return;
        }
        var cityMapPos = g_GameGlobalManager.gameData.getCityById(cityId)._cityPos;
        if (g_GameTool.judgeEqualPos(cityMapPos, person._goalCityMapPos)) {
            //修正一下
            person._pos.cityId = cityId;
            return;
        }
        //TODO 改变目的地，这个距离会在时间更新处进行计算
        person._goalCityMapPos = cityMapPos;
        person._goalCityId = cityId;
        //如果当前有大地图坐标的话就以这个数据为出发点，否则使用当前城市的大地图坐标为出发点
        if (person._pos.cityId !== -1) {
            person._nowMapPos = g_GameGlobalManager.gameData.getCityById(person._pos.cityId)._cityPos;
        }
        //立马出城
        person._pos.cityId = -1;
    };
    //前往一个设施
    person.goToBuilding = function (buildingId) {
        if (person._inInBattle) {
            return;
        }
        if (buildingId === -1) {
            //自宅
            if (person._pos.cityId === person._homePos) {
                person._pos.buildingId = buildingId;
                return;
            }
        }
        var nearCityData = g_GameTool.getNearBuildingCity(buildingId, person._pos.cityId, undefined, person);
        if (nearCityData._id !== person._pos.cityId) {
            person.goToCity(nearCityData._id);
            return;
        }
        //城市内的建筑是立马到达的
        person._pos.buildingId = buildingId;
    };
    //任务完成的回调
    person.actionFinishCb = function (action) {
        //表示任务执行完了
        person._nowAction = undefined;
        person.getItem(action._rewardArr);
        //TODO 要不要修改成实时的改变，中间人物可以停止
        person._power = person._power - action._costPower;
        person._money = person._money - action._costMoney || 0;
        if (person._power < 0) {
            person._power = 0;
            g_LogTool.showLog(person._name + ' power error, action is ' + action._name);
        }
        if (person._money < 0) {
            person._money = 0;
            g_LogTool.showLog(person._name + ' money error, action is ' + action._name);
        }
    };
    //获得了物品
    person.getItem = function (rewardArr) {
        var i = void 0,
            j = void 0;
        for (i = 0; i < rewardArr.length; i++) {
            var id = rewardArr[i];
            var num = rewardArr[i + 1];
            for (j = 0; j < num; j++) {
                var sellData = SellGoodFactory.createOneSellGood(id, undefined, person);
                person._itemArr.push(sellData);
            }
            i++;
        }
    };
    //时间变化函数
    person.timeUpdate = function (addMinutes) {
        if (person._inInBattle) {
            return;
        }
        if (person._nowAction) {
            //执行动作
            g_LogTool.showLog(person._name + ' \u6B63\u5728\u6267\u884C ' + person._nowAction._name);
            if (person._nowAction.doAction(person)) {
                person._nowAction.timeUpdate(person, addMinutes);
            }
        } else {
            person._nowAction = local.judgeNextAction(person);
            g_LogTool.showLog(person._name + ' \u5F00\u59CB\u6267\u884C ' + person._nowAction._name);
            if (person._nowAction.doAction(person)) {
                person._nowAction.timeUpdate(person, addMinutes);
            }
        }
        local.changeMapPos(person, addMinutes);
    };
    //日期变化函数
    person.dayUpdate = function () {
        person._itemArr.forEach(function (oneSellGoodData) {
            if (oneSellGoodData.dayUpdate) {
                oneSellGoodData.dayUpdate(person);
            }
        });
    };
    //获取一个标记物品的id
    person.getNewItemId = function () {
        person._maxItemId++;
        return person._maxItemId - 1;
    };
    //移除一个物品
    person.removeItemByItemId = function (itemId) {
        var i = void 0,
            len = void 0,
            index = void 0;
        for (i = 0, len = person._itemArr.length; i < len; i++) {
            if (person._itemArr[i]._itemId === itemId) {
                index = i;
                person._itemArr.splice(index, 1);
                break;
            }
        }
    };
    //出售指定id的商品，没有指定的话表示全部
    person.sellGood = function (itemId) {
        if (!itemId) {
            //出售全部
            person._itemArr.forEach(function (oneItemData) {
                oneItemData.sell(person);
            });
            person._itemArr = [];
            return;
        }
        var i = void 0,
            len = void 0,
            index = void 0;
        for (i = 0, len = person._itemArr.length; i < len; i++) {
            if (person._itemArr[i]._itemId === itemId) {
                index = i;
                person._itemArr[i].sell(person);
                person._itemArr.splice(index, 1);
                break;
            }
        }
    };
    //获取存储的数据
    person.getSaveData = function () {
        return {
            name: person._name,
            attack: person._attack,
            def: person._def,
            command: person._command,
            intelligence: person._intelligence,
            charm: person._charm,
            politics: person._politics,
            maxHp: person._maxHp,
            sex: person._sex,
            moveSpeed: person._moveSpeed,
            presonSkillId: person._presonSkillId,
            battleSkillId: person._battleSkillId,
            equipAttack: person._equipAttack,
            equipDef: person._equipDef,
            equipJewelry: person._equipJewelry,
            equipHorse: person._equipHorse,
            nowHp: person._nowHp,
            id: person._id,
            pos: person._pos,
            homePos: person._homePos,
            goalCityMapPos: person._goalCityMapPos,
            nowMapPos: person._nowMapPos,
            goalCityId: person._goalCityId,
            nowAction: person._nowAction ? person._nowAction.getSaveData() : undefined,
            itemArr: person._itemArr.map(function (oneItemData) {
                return oneItemData.getSaveData();
            }),
            money: person._money,
            power: person._power,
            maxItemId: person._maxItemId
        };
    };
    //死亡回调
    /**
     * @param personAttack 击杀者
     */
    person.deadCb = function (personAttack) {
        g_LogTool.showLog(personAttack._name + ' \u51FB\u6740\u4E86 ' + person._name);
    };
    //开始战斗的回调
    person.startBattleCb = function () {
        person._inInBattle = true;
    };
    //战斗结束回调
    person.battleFinishCb = function () {
        if (person._nowHp < g_GlobalData.MIN_HP_NUM * person._maxHp) {
            person.treat();
        }
        person._inInBattle = false;
    };
    //回复血量
    person.treat = function () {
        var i = void 0,
            len = person._itemArr.length;
        for (i = 0; i < len; i++) {
            if (person._itemArr[i].judgeHaveFunctionByName('treat')) {
                person._itemArr[i].use();
            }
            if (person._nowHp >= person._maxHp) {
                break;
            }
        }
        if (person._nowHp < g_GlobalData.MIN_HP_NUM * person._maxHp) {
            //这个时候增加一个医馆行动
            var action = ActionFactory.createOneAction(6);
            if (action._costMoney > person._money) {
                this._nowAction = ActionFactory.createOneAction(4);
            } else {
                this._nowAction = action;
            }
        } else {
            g_LogTool.showLog(person._name + ' \u4F7F\u7528\u98DF\u7269\u6CBB\u7597\u7ED3\u675F');
        }
    };
    //触发大地图随机事件
    person.mapRandomEventCb = function () {};
    //使用自宅
    person.useHome = function () {
        person._nowHp = person._maxHp;
        g_LogTool.showLog(person._name + ' \u5728\u5BB6\u4F11\u606F\u7ED3\u675F');
    };
};

/**
 * @param personId 初始化一个角色，这个是新建一个角色
 * @param randomData 随机数据
 */
local.createOneBasePerson = function (personId, randomData, cityId) {
    //先定义数据，方便查找
    //this._personId = parseInt(personId);
    //配置数据
    var jsonData = randomData || g_JsonDataTool.getDataById('_table_person_person', personId);
    //名字
    this._name = jsonData.name;
    //攻击力
    this._attack = jsonData.attack;
    //防御力
    this._def = jsonData.def;
    //统帅
    this._command = jsonData.command;
    //智力
    this._intelligence = jsonData.intelligence;
    //魅力
    this._charm = jsonData.charm;
    //政治
    this._politics = jsonData.politics;
    //生命值
    this._maxHp = jsonData.hp;
    //性别
    this._sex = jsonData.sex;
    //大地图移动速度
    this._moveSpeed = jsonData.moveSpeed;
    //个人技能
    this._presonSkillId = jsonData.presonSkillId || 1;
    //TODO 需要新建一个技能

    //战争技能
    this._battleSkillId = jsonData.battleSkillId || 1;
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
        cityId: cityId || 0,
        buildingId: -1
    };
    //家的位置，是一个城市id
    this._homePos = cityId || 0;
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
    this._money = 0;
    //体力
    this._power = g_GlobalData.MAX_POWER;
    //标记物品id的最大值
    this._maxItemId = 1;
    //是否在战斗中
    //暂定是不记录战斗信息
    this._inInBattle = false;

    local.buildFunc(this);
};

/**
 * @param saveData 根据存储的数据生成一个角色
 */
local.createOneBasePersonBySaveData = function (saveData) {
    //名字
    this._name = saveData.name;
    //攻击力
    this._attack = saveData.attack || 0;
    //防御力
    this._def = saveData.def;
    //统帅
    this._command = saveData.command;
    //智力
    this._intelligence = saveData.intelligence;
    //魅力
    this._charm = saveData.charm;
    //政治
    this._politics = saveData.politics;
    //生命值
    this._maxHp = saveData.maxHp;
    //性别
    this._sex = saveData.sex;
    //大地图移动速度
    this._moveSpeed = saveData.moveSpeed;
    //个人技能
    this._presonSkillIdArr = saveData.presonSkillId ? ('' + saveData.presonSkillId).split(',') : [];
    //TODO 需要新建一个技能

    //战争技能
    this._battleSkillIdArr = saveData.battleSkillId ? ('' + saveData.battleSkillId).split(',') : [];
    //TODO 需要新建一个技能

    //这边是存储的配置
    //武器装备
    this._equipAttack = saveData.equipAttack;
    //防御装备
    this._equipDef = saveData.equipDef;
    //首饰
    this._equipJewelry = saveData.equipJewelry;
    //坐骑
    this._equipHorse = saveData.equipHorse;
    //血量
    this._nowHp = saveData.nowHp;
    //唯一id
    this._id = saveData.id;
    //位置
    //初始都是在家的
    this._pos = saveData.pos;
    //家的位置，是一个城市id
    this._homePos = saveData.homePos;
    //目的地
    this._goalCityMapPos = saveData.goalCityMapPos;
    //到目的地的剩余的距离
    this._nowMapPos = saveData.nowMapPos;
    //目标城市的id
    this._goalCityId = saveData.goalCityId;
    //当前执行的任务
    this._nowAction = saveData.nowAction ? ActionFactory.createOneAction(undefined, saveData.nowAction) : undefined;
    //当前的人物的物品数据
    this._itemArr = saveData.itemArr.map(function (oenData) {
        return SellGoodFactory.createOneSellGood(undefined, oenData, undefined);
    });
    //货币数量
    this._money = saveData.money;
    //体力
    this._power = saveData.power;
    //标记物品id的最大值
    this._maxItemId = saveData.maxItemId;
    //是否在战斗中
    //暂定是不记录战斗信息
    this._inInBattle = false;

    local.buildFunc(this);
};

/**
 * 新建一个随机人物
 * @param sex 性别
 */
outModule.createRandomPerson = function (sex, cityId) {
    var randomData = {};
    //默认是男性
    randomData.sex = sex || g_GlobalData.SEX_MAN;
    randomData.name = RandomNameTool.getRandomName(randomData.sex);
    //随机数据
    randomData.attack = 40 + Math.ceil(cc.random0To1() * 60);
    randomData.def = 40 + Math.ceil(cc.random0To1() * 60);
    randomData.command = 40 + Math.ceil(cc.random0To1() * 60);
    randomData.intelligence = 40 + Math.ceil(cc.random0To1() * 60);
    randomData.charm = 40 + Math.ceil(cc.random0To1() * 60);
    randomData.politics = 40 + Math.ceil(cc.random0To1() * 60);
    randomData.hp = 600 + Math.ceil(cc.random0To1() * 400);
    randomData.moveSpeed = 5;
    return new local.createOneBasePerson(undefined, randomData, cityId);
};

/**
 * @param personId 人物id
 * @param saveData 存储数据
 * @param cityId 出生地
 */
outModule.createOneBasePerson = function (personId, saveData, cityId) {
    if (saveData) {
        return new local.createOneBasePersonBySaveData(saveData);
    }
    return new local.createOneBasePerson(personId, undefined, cityId);
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
        //# sourceMappingURL=PersonFactory.js.map
        