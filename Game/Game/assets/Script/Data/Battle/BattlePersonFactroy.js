/*global module, require, cc, client */
/**
 * @desc 对人物数据进行封装，增加一些属性用于战斗
 * @author Administrator
 */

var SkillFactory = require('SkillFactory');
var BattleManager = require('BattleManager');

var outModule = {};

outModule.buildBattlePerson = (person, pos, automaticType, isUserHero) => {
    //是否是玩家英雄
    person._b_isUserHero = isUserHero;
    //位置
    person.b_pos = pos;
    //技能
    person._b_skillArr = [];
    //自动选项
    person._b_automaticType = automaticType;
    //加入一个普通攻击
    person._b_skillArr.push(new SkillFactory.buildAttackSkill(person._r_attackSpeed, person._r_moveSpeed));
    //初始化技能
    person._r_skillIdArr.forEach(function (skillId) {
        this._b_skillArr.push(new SkillFactory.buildOneSkill(skillId, person._b_automaticType));
    }.bind(this));

    //是否被控制
    person._b_isInControl = false;
    //控制持续时间
    person._b_controSurpluslTime = 0;

    //是否处于技能施放中
    person._b_isInUsing = false;

    person._b_hp = person._r_hp;
    person._b_mp1 = person._r_mp1;

    person._b_node = undefined;

    person._b_isDead = false;

    //英雄的更新
    person.update = function (time) {
        if (person._b_controSurpluslTime === 0) {
            return;
        }
        person._b_controSurpluslTime = person._b_controSurpluslTime - time;
        if (person._b_controSurpluslTime <= 0) {
            person._b_controSurpluslTime = 0;
            person._b_isInControl = false;
        }
    };
    //全局暂停了游戏的回调
    person.pause = function () {

    };
    //全局重新开始游戏的回调
    person.resume = function () {

    };
    //全局开始游戏的回调
    person.start = function () {

    };
    //全局结束游戏的回调
    person.stop = function () {

    };

    /**
     * 英雄受伤回调
     * @param {*} hurtSkill 造成伤害的技能
     * @param {*} hurtNumResult 造成的伤害
     * @param {*} hurtFromPerson 造成伤害的来源
     */
    person.beHurtCb = function (hurtSkill, hurtNumResult, hurtFromPerson) {
        let oldHp = person._b_hp;
        person._b_hp = person._b_hp - hurtNumResult;
        person._b_node.getChildByName('Hp').getComponent(cc.Label).string = `${person._b_hp}/${person._r_hp}`;
        if (person._b_hp <= 0 && oldHp > 0) {
            person.beDeadCb(hurtFromPerson);
        }
        hurtFromPerson.hurtCb(hurtSkill, hurtNumResult, person._b_hp <= 0 && oldHp > 0);
    };

    /**
     * 死亡回调
     */
    person.beDeadCb = function (hurtFromPerson) {
        //删除结点
        person._b_isDead = true;
        person._b_node.active = false;
        g_LogTool.showLog(`${hurtFromPerson._r_unitName}击杀${person._r_unitName}`);
        BattleManager.clearDead();
    };

    /**
     * 伤害反馈回调，用于计算吸血的相关内容
     * @param {Boolean} isDead 是否造成对方死亡
     */
    person.hurtCb = function (hurtSkill, hurtNumResult, isDead) {

    };

    person.move = function () {
        if (person._b_node.getChildByName('Role').getComponent(sp.Skeleton).animation !== "run_1") {
            person._b_node.getChildByName('Role').getComponent(sp.Skeleton).animation = "run_1";
        }
        let addX = person._r_moveSpeed / 100;
        if (!person._b_isUserHero) {
            addX = -1 * addX;
        }
        let newX = person._b_node.x + addX;
        let action = cc.moveTo(g_BATTLE_TIMER_TIME, cc.p(newX, person._b_node.y));
        //person._b_node.stopAllActions();
        person._b_node.runAction(cc.sequence(action, cc.callFunc(function () {
            person._b_node.x = newX;
        })));
    };

    return person;
};

module.exports = outModule;