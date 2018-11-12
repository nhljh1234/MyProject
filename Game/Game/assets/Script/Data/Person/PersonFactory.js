/*global module, require, cc, client */
var outModule = {};
var local = {};
var RandomNameTool = require('RandomNameTool');
var ActionFactory = require('ActionFactory');
var SellGoodFactory = require('SellGoodFactory');

const MAX_ITEM_NUM = 100;

/**
 * 没有任务的时候会去判断下一步应该执行什么任务
 */
local.judgeNextAction = (person) => {
    if (person._itemArr.length > MAX_ITEM_NUM) {
        return ActionFactory.createOneAction(5);
    }
    if (person._power < g_GlobalData.MAX_POWER / 2) {
        //睡觉
        return (cc.random0To1() < 0.5) ? ActionFactory.createOneAction(3) : ActionFactory.createOneAction(4);
    } else {
        return (cc.random0To1() < 0.5) ? ActionFactory.createOneAction(1) : ActionFactory.createOneAction(2);
    }
};

/**
 * @param person 已经加好数据的人物，再增加一些操作函数
 */
local.buildFunc = function (person) {
    //前往一个地点
    person.goToCity = function (cityId) {
        //cityId为0表示在野外
        if (cityId === person._pos[0]) {
            person._goalPosCity = undefined;
            return;
        }
        if (person._goalPosCity === cityId) {
            return;
        }
        //TODO 改变目的地，这个距离会在时间更新处进行计算
        person._goalPosCity = cityId;
        person._goalDis = g_GameTool.getCityDis(cityId, person._pos[0]);
        //立马出城
        person._pos[0] = 0;
        g_LogTool.showLog(`${person._name} go to ${g_GameGlobalManager.gameData.getCityById(cityId)._name}`);
    };
    //前往一个设施
    person.goToBuilding = function (buildingId) {
        if (person._pos[0] === 0) {
            //在野外，处于寻路状态
            return;
        }
        if (buildingId === -1) {
            //自宅
            if (person._pos[0] === person._homePos) {
                person._pos[1] = buildingId;
                return;
            }
        }
        let nearCityData = g_GameTool.getNearBuildingCity(buildingId, person._pos[0], undefined, person);
        if (nearCityData._id !== person._pos[0]) {
            person.goToCity(nearCityData._id);
            return;
        }
        //城市内的建筑是立马到达的
        person._pos[1] = buildingId;
        //判断是否要使用建筑功能
        g_GameGlobalManager.gameData.getCityById(person._pos[0]).getBuildingById(buildingId).useBuilding(person);
    };
    //任务完成的回调
    person.actionFinishCb = function (action) {
        //表示任务执行完了
        person._nowAction = undefined;
        person.getItem(action._rewardArr);
        //TODO 要不要修改成实时的改变，中间人物可以停止
        person._power = person._power - action._costPower;
        person._money = person._money - action._costMoney;
    };
    //获得了物品
    person.getItem = function (rewardArr) {
        let i, j;
        for (i = 0; i < rewardArr.length; i++) {
            let id = rewardArr[i];
            let num = rewardArr[i + 1];
            for (j = 0; j < num; j++) {
                let sellData = SellGoodFactory.createOneSellGood(id, undefined, person);
                person._itemArr.push(sellData);
            }
            i++;
        }
    };
    //时间变化函数
    person.timeUpdate = function (addMinutes) {
        if (person._nowAction) {
            //执行动作
            if (person._nowAction.doAction(person)) {
                g_LogTool.showLog(`${person._name} do ${person._nowAction._name}`);
                person._nowAction.timeUpdate(person, addMinutes);
            }
        } else {
            person._nowAction = local.judgeNextAction(person);
            if (person._nowAction.doAction(person)) {
                person._nowAction.timeUpdate(person, addMinutes);
            }
        }
        if (person._goalDis > 0) {
            person._goalDis = person._goalDis - Math.ceil((addMinutes / 10) * person._moveSpeed);
            if (person._goalDis <= 0) {
                person._goalDis = 0;
                person._pos[0] = person._goalPosCity;
                person._goalPosCity = 0;
                g_LogTool.showLog(`${person._name} in ${g_GameGlobalManager.gameData.getCityById(person._pos[0])._name}`);
            }
        }
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
    }
    //移除一个物品
    person.removeItemByItemId = function (itemId) {
        let i, len, index;
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
            person._itemArr.forEach((oneItemData) => {
                oneItemData.sell(person);
            });
            person._itemArr = [];
            return;
        }
        let i, len, index;
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
            goalPosCity: person._goalPosCity,
            goalDis: person._goalDis,
            nowAction: person._nowAction ? person._nowAction.getSaveData() : undefined,
            itemArr: person._itemArr.map(function (oneItemData) {
                return oneItemData.getSaveData();
            }),
            money: person._money,
            power: person._power,
            maxItemId: person._maxItemId
        }
    };
};

/**
 * @param personId 初始化一个角色，这个是新建一个角色
 * @param randomData 随机数据
 */
local.createOneBasePerson = function (personId, randomData, cityId) {
    //先定义数据，方便查找
    this._personId = parseInt(personId);
    //配置数据
    var jsonData = randomData || g_JsonDataTool.getDataById('_table_person_person', personId);
    //名字
    this._name = jsonData.name;
    //攻击力
    this._attack = jsonData.attack || 0;
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
    this._pos = [cityId || 0, -1];
    //家的位置，是一个城市id
    this._homePos = cityId || 0;
    //目的地
    this._goalPosCity = 0;
    //到目的地的剩余的距离
    this._goalDis = 0;
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
    this._maxHp = saveData.hp;
    //性别
    this._sex = saveData.sex;
    //大地图移动速度
    this._moveSpeed = saveData.moveSpeed;
    //个人技能
    this._presonSkillId = saveData.presonSkillId || 1;
    //TODO 需要新建一个技能

    //战争技能
    this._battleSkillId = saveData.battleSkillId || 1;
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
    this._nowHp = saveData.maxHp;
    //唯一id
    this._id = saveData.id;
    //位置
    //初始都是在家的
    this._pos = saveData.pos;
    //家的位置，是一个城市id
    this._homePos = saveData.homePos;
    //目的地
    this._goalPosCity = saveData.goalPosCity;
    //到目的地的剩余的距离
    this._goalDis = saveData.goalDis;
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

    local.buildFunc(this);
};

/**
 * 新建一个随机人物
 * @param sex 性别
 */
outModule.createRandomPerson = (sex, cityId) => {
    //默认是男性
    sex = sex ? sex : g_GlobalData.SEX_MAN;
    //随机数据
    var randomData = {};
    randomData.sex = sex;
    randomData.name = RandomNameTool.getRandomName(sex);
    randomData.attack = Math.ceil(cc.random0To1() * 100);
    randomData.def = Math.ceil(cc.random0To1() * 100);
    randomData.command = Math.ceil(cc.random0To1() * 100);
    randomData.intelligence = Math.ceil(cc.random0To1() * 100);
    randomData.charm = Math.ceil(cc.random0To1() * 100);
    randomData.politics = Math.ceil(cc.random0To1() * 100);
    randomData.hp = 400 + Math.ceil(cc.random0To1() * 400);
    randomData.moveSpeed = 5;
    return new local.createOneBasePerson(undefined, randomData, cityId);
};

/**
 * @param personId 人物id
 * @param saveData 存储数据
 * @param cityId 出生地
 */
outModule.createOneBasePerson = (personId, saveData, cityId) => {
    if (saveData) {
        return new local.createOneBasePersonBySaveData(saveData);
    }
    return new local.createOneBasePerson(personId, undefined, cityId);
};

module.exports = outModule;