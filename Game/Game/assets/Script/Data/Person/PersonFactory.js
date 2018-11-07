/*global module, require, cc, client */
var outModule = {};
var local = {};
var RandomNameTool = require('RandomNameTool');
var ActionFactory = require('ActionFactory');
var GameTool = require('GameTool');

/**
 * 没有任务的时候会去判断下一步应该执行什么任务
 */
local.judgeNextAction = (person) => {
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
        //TODO 改变目的地，这个距离会在时间更新处进行计算
        person._goalPosCity = cityId;
    };
    //前往一个设施
    person.goToBuilding = function (buildingId) {
        if (buildingId === -1) {
            //自宅
            if (person._pos[0] === person._homePos) {
                person._pos[1] = buildingId;
                return;
            }
        }
        let nearCityData = GameTool.getNearBuildingCity(buildingId, person._pos[0], undefined);
        if (nearCityData._id !== person._pos[0]) {
            person.goToCity(nearCityData._id);
            return;
        }
        //城市内的建筑是立马到达的
        person._pos[1] = buildingId;
    };
    //任务完成的回调
    person.actionFinishCb = function (action) {
        //表示任务执行完了
        person._nowAction = undefined;
        person.getItem(action._rewardArr);
        //TODO 要不要修改成实时的改变，中间人物可以停止
        person._power = person._power - action.costPower;
        person._money = person._money - action.costMoney;
        g_LogTool.showLog(`${person._name}: do ${action._name} finish`);
    };
    //获得了物品
    person.getItem = function (rewardArr) {
        if (!person._itemObj) {
            person._itemObj = {};
        }
        let i;
        for (i = 0; i < rewardArr.length; i++) {
            person._itemObj[rewardArr[i]] = person._itemObj[rewardArr[i]] + rewardArr[i + 1];
        }
    };
    //时间变化函数
    person.timeUpdate = function (addMinutes) {
        if (this._nowAction) {
            //执行动作
            if (this._nowAction.doAction(person)) {
                this._nowAction.timeUpdate(person, addMinutes);
            }
        } else {
            this._nowAction = local.judgeNextAction(person);
            g_LogTool.showLog(`${person._name}: start do ${this._nowAction._name}`);
            if (this._nowAction.doAction(person)) {
                this._nowAction.timeUpdate(person, addMinutes);
            }
        }
    };
};

/**
 * @param personId 初始化一个角色，这个是新建一个角色
 * @param randomData 随机数据
 */
local.createOneBasePerson = function (personId, randomData, cityId) {
    //先定义数据，方便查找
    this._id = parseInt(personId);
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
    //当前执行的任务
    this._nowAction = undefined;
    //当前的人物的物品数据
    this._itemObj = {};
    //货币数量
    this._money = 0;
    //体力
    this._power = g_GlobalData.MAX_POWER;

    local.buildFunc(this);
};

/**
 * @param saveData 根据存储的数据生成一个角色
 */
local.createOneBasePersonBySaveData = function (saveData) {

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