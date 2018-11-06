/*global module, require, cc, client */
var outModule = {};
var local = {};

/**
 * 没有任务的时候会去判断下一步应该执行什么任务
 */
local.judgeNextQuest = (person) => {

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
        //改变目的地，这个距离会在时间更新处进行计算
        person._goalPosCity = cityId;
    };
    //前往一个设施
    person.goToBuilding = function (cityId, buildingId) {
        if (cityId !== person._pos[0]) {
            person.goToCity(cityId);
            return;
        }
        if (buildingId === person._pos[1]) {
            return;
        }
        //城市内的建筑是立马到达的
        person._pos[1] = buildingId;
    };
    //任务完成的回调
    person.questFinishCb = function (quest) {
        //表示任务执行完了
        person._nowQuest = undefined;
        person.getItem(quest._rewardArr);
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
};

/**
 * @param personId 初始化一个角色，这个是新建一个角色
 */
local.createOneBasePerson = function (personId) {
    //先定义数据，方便查找
    this._roleId = personId;
    //配置数据
    var jsonData = g_JsonDataTool.getDataById('_table_person_person', personId);
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
    //生命值
    this._maxHp = jsonData.hp;
    //个人技能
    this._presonSkillId = jsonData.presonSkillId;
    //TODO 需要新建一个技能

    //战争技能
    this._battleSkillId = jsonData.battleSkillId;
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
    this._id = undefined;
    //位置
    this._pos = [0, 0];
    //目的地
    this._goalPosCity = 0;
    //当前执行的任务
    this._nowQuest = undefined;
    //当前的人物的物品数据
    this._itemObj = {};

    local.buildFunc(this);
};

/**
 * @param saveData 根据存储的数据生成一个角色
 */
local.createOneBasePersonBySaveData = function (saveData) {

    local.buildFunc(this);
};

/**
 * @param personId 人物id
 * @param saveData 存储数据
 */
outModule.getPersonData = (personId, saveData) => {
    if (saveData) {
        return new local.createOneBasePersonBySaveData(saveData);
    }
    return new local.createOneBasePerson(personId);
};

module.exports = outModule;