var outModule = {};
var local = {};

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

    
};

/**
 * 根据存储的数据新建一个主角数据
 */
local.createUserRoleBySaveData = function (saveData) {

};

outModule.createUserRole = function (saveData, randomData) {
    if (saveData) {
        return new local.createUserRoleBySaveData(saveData);
    }
    return new local.createUserRole();
};

module.exports = outModule;