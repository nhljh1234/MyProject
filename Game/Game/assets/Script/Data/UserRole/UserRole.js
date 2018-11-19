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
        cityId: g_JsonDataTool.getDataById('_table_Game_gameParameter', 2) || 1,
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