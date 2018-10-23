/*global module, require, cc, client */
var outModule = {};

//新建一个基础角色
outModule.createOneBasePerson = function (personId) {
    //先定义数据，方便查找
    this._r_hp = 0;
    this._r_mp = 0;
    //属性
    this._r_power = 0;//力量
    this._r_int = 0;//智力
    this._r_agile = 0;//敏捷
    this._r_violentAttack = 0;//暴击
    this._r_dodge = 0;//闪避
    this._r_name = "";//名字
    //技能
    this._r_skillIdArr = [];

    this._r_jsonData = g_JsonDataTool.getDataById('_table_head_icon_icon', personId);

    //获取头像的spriteFrame
    this.getHeadIcon = function () {

    };
};

module.exports = outModule;