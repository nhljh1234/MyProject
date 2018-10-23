var outModule = {};

//新建一个基础角色
outModule.createOneBasePerson = function (personId) {
    //先定义数据，方便查找
    this.hp = 0;
    this.mp = 0;
    //属性
    this.power = 0;//力量
    this.int = 0;//智力
    this.agile = 0;//敏捷
    this.violentAttack = 0;//暴击
    this.dodge = 0;//闪避
    this.name = "";//名字

    this.jsonData = g_JsonDataTool.getDataById('_table_head_icon_icon', personId);

    //获取头像的spriteFrame
    this.getHeadIcon = function () {

    };
};

module.exports = outModule;