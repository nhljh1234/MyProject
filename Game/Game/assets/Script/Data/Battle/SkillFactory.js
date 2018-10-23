/*global module, require, cc, client */
/**
 * @desc 技能工厂
 * @author Administrator
 */

var SkillControl = require('SkillControl');

var outModule = {};

/**
 * 新建一个技能
 * 普通攻击也是一个技能
 * @param skillId
 * @param automaticType 自动释放技能的逻辑
 */
outModule.buildOneSkill = (skillId, automaticType) => {
    //技能冷却时间
    this._skillTime = 0;
    //技能发起剩余时间
    this.skillLeftTime = 0;
    //自动技能逻辑
    this._automaticType = automaticType;
    //技能数据
    this._jsonData = g_JsonDataTool.getDataById("_table_head_icon_icon", skillId);

    //定时更新函数
    this.update = function (time) {
        //这边更新技能时间
        this.skillLeftTime = this.skillLeftTime - time;
        if (this.skillLeftTime <= 0) {
            this.skillLeftTime = 0;
            //判断要不要执行技能
            if (SkillControl.judgeUseSkill(this)) {
                this.useSkill();
            }
        }
    };

    this.useSkill = function () {

    };
};

module.exports = outModule;
