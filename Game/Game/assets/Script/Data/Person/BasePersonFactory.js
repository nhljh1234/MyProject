/*global module, require, cc, client */
var outModule = {};
var local = {};

/**
 * @param person 已经加好数据的商品，再增加一些操作函数
 */
local.buildFunc = (person) => {
    
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

    local.buildFunc(this);
};

/**
 * @param saveData 根据存储的数据生成一个角色
 */
local.createOneBasePersonBySaveData = (saveData) => {

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