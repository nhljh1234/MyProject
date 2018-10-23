/*global module, require, cc, client */
/**
 * @desc 对人物数据进行封装，增加一些属性用于战斗
 * @author Administrator
 */

var SkillFactory = require('SkillFactory');

var outModule = {};

outModule.buildBattlePerson = (person, pos, automaticType) => {
    //位置
    person.b_pos = pos;
    //技能
    person._b_skillArr = [];
    //自动选项
    person._b_automaticType = automaticType;
    //初始化技能
    person._r_skillIdArr.forEach(function (skillId) {
        this._b_skillArr.push(SkillFactory.buildOneSkill(skillId, person._b_automaticType));
    }.bind(this));

    return person;
};

module.exports = outModule;