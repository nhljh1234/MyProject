/*global module, require, cc, client */
/**
 * @desc 技能工厂
 * @author Administrator
 */

var SkillControl = require('SkillControl');

var outModule = {};
var local = {};

local.getNatureHurtNum = function (personAttack, personOther) {
    if (personAttack._r_nature === 1 && personOther._r_nature === 5) {
        return 1.2;
    } else if (personAttack._r_nature === 1 && personOther._r_nature === 4) {
        return 0.8;
    } else if (personAttack._r_nature === 2 && personOther._r_nature === 4) {
        return 1.2;
    } else if (personAttack._r_nature === 2 && personOther._r_nature === 3) {
        return 0.8;
    } else if (personAttack._r_nature === 3 && personOther._r_nature === 2) {
        return 1.2;
    } else if (personAttack._r_nature === 3 && personOther._r_nature === 5) {
        return 0.8;
    } else if (personAttack._r_nature === 4 && personOther._r_nature === 1) {
        return 1.2;
    } else if (personAttack._r_nature === 4 && personOther._r_nature === 2) {
        return 0.8;
    } else if (personAttack._r_nature === 5 && personOther._r_nature === 3) {
        return 1.2;
    } else if (personAttack._r_nature === 5 && personOther._r_nature === 1) {
        return 0.8;
    } else if (personAttack._r_nature === 6 && personOther._r_nature === 7) {
        return 1.2;
    } else if (personAttack._r_nature === 7 && personOther._r_nature === 6) {
        return 1.2;
    }
    return 1;
};

/**
 * 计算伤害量
 * @param personAttack 攻击方
 * @param personOther 防守方
 */
local.getHurtNum = function (personAttack, personOther, attackType) {
    //判定是否命中
    let attackRateLevel, attackDodgeLevel, attackDodgeLevelC;
    attackDodgeLevelC = 500;
    //闪避率
    let missNum = 0;
    if (attackType === g_ATTACK_TYPE_PHY) {
        attackRateLevel = personAttack._r_attackHit;
        attackDodgeLevel = personOther._r_attackDodge;
    } else {
        attackRateLevel = personAttack._r_skillHitLevel;
        attackDodgeLevel = personOther._r_skillDodgeLevel;
    }
    if (attackRateLevel > attackDodgeLevel) {
        missNum = 0;
    } else {
        missNum = (attackDodgeLevel - attackRateLevel ) / (attackDodgeLevelC + (attackDodgeLevel - attackRateLevel));
    }
    //判断是否命中
    if (cc.random0To1() < missNum) {
        //闪避了
        return {
            num: 0,
            type: g_HURT_RESULT_MISS
        };
    }
    //判断是否暴击
    let attackStrikeLevel, strikeResistanceLevel, attackStrikeCNum_1, attackStrikeCNum_2, strikeDefNum, strikeDefNumC;
    let StrikeNum = 0;
    //attackStrikeCNum_1 修正系数
    //attackStrikeCNum_2 修正参数
    if (attackType === g_ATTACK_TYPE_PHY) {
        attackStrikeLevel = personAttack._r_attackStrikeLevel;
        strikeResistanceLevel = personOther._r_attackStrikeResistance;
        strikeDefNum = personOther._r_armor;
        strikeDefNumC = 20;
        attackStrikeCNum_1 = 0.5;
        attackStrikeCNum_2 = 50;
    } else {
        attackStrikeLevel = personAttack._r_skillStrikeLevel;
        strikeResistanceLevel = personOther._r_skillStrikeResistance;
        strikeDefNum = personOther._r_skillResistance;
        strikeDefNumC = 10;
        attackStrikeCNum_1 = 0.5;
        attackStrikeCNum_2 = 100;
    }
    if (attackStrikeLevel > strikeResistanceLevel) {
        StrikeNum = 0;
    } else {
        let n = (attackStrikeLevel - attackStrikeLevel);
        StrikeNum = n / (n * attackStrikeCNum_1 + strikeDefNum * strikeDefNumC + attackStrikeCNum_2);
    }
    //判断是否暴击
    let violentFlag = false;
    if (cc.random0To1() < StrikeNum) {
        //暴击了
        violentFlag = true;
    }
    let attackNum, strikeDamage, defNum, hurtNum, hurtNumDef, armor;
    if (attackType === g_ATTACK_TYPE_PHY) {
        attackNum = personAttack._r_attackDamage;
        strikeDamage = personAttack._r_attackStrikeDamage / 100;
        //修正系数
        defNum = 10;
        //修正参数
        hurtNum = 200;
        armor = personOther._r_armor - personAttack._r_armorIgnore;
        armor = armor < 0 ? 0 : armor;
    } else {
        attackNum = personAttack._r_skillDamage;
        strikeDamage = personAttack._r_skillStrikeDamage / 100;
        defNum = 5;
        hurtNum = 100;
        armor = personOther._r_skillResistance - personAttack._r_skillResistanceIgnore;
        armor = armor < 0 ? 0 : armor;
    }
    if (!violentFlag) {
        strikeDamage = 1;
    }
    //伤害抵消系数
    hurtNumDef = attackNum / (attackNum + armor * defNum + hurtNum);
    //有一个属性克制，还需要实现
    return {
        num: Math.ceil(attackNum * hurtNumDef * strikeDamage * local.getNatureHurtNum(personAttack, personOther)),
        type: violentFlag ? g_HURT_RESULT_STRIKE : undefined
    }
};

/**
 * 新建一个技能
 * 普通攻击也是一个技能
 * @param skillId
 * @param automaticType 自动释放技能的逻辑
 */
outModule.buildOneSkill = function (skillId, automaticType) {
    //技能冷却时间
    this._skillTime = 0;
    //技能发起剩余时间
    this._skillSurplusTime = this._skillTime;
    //自动技能逻辑
    this._automaticType = automaticType;
    //技能数据
    this._jsonData = g_JsonDataTool.getDataById("_table_head_icon_icon", skillId);

    //是否处于技能施放中
    this._isInUsing = false;
    //技能施放剩余时间
    this._inUsingSurplusTime = 0;

    //定时更新函数
    this.update = function (time, personData) {
        //这边更新技能时间
        this._skillSurplusTime = this._skillSurplusTime - time;
        if (this._inUsingSurplusTime > 0 && this._inUsingSurplusTime <= time) {
            //默认规定是同时只能吟唱一个技能
            personData._b_isInUsing = false;
            this._inUsingSurplusTime = 0;
        } else {
            this._inUsingSurplusTime = this._inUsingSurplusTime - time;
        }
        if (this._skillSurplusTime <= 0) {
            this._skillSurplusTime = 0;
            //判断要不要执行技能
            if (personData._b_isInControl) {
                return;
            }
            if (personData._b_isInUsing) {
                return;
            }
            let attackPersonData = SkillControl.judgeUseSkill(this, personData);
            if (attackPersonData) {
                this.useSkill(personData, attackPersonData);
                this._skillSurplusTime = this._skillTime;
            } else {
                //不行的话就移动
                personData.move();
            }
        }
    };

    this.useSkill = function () {

    };
};

//创建普通技能
outModule.buildAttackSkill = function (attackSpeed, moveSpeed) {
    //技能冷却时间
    this._skillTime = attackSpeed / 1000;
    this._moveSpeed = moveSpeed;
    //技能发起剩余时间
    this._skillSurplusTime = this._skillTime;
    //技能数据
    //this._jsonData = g_JsonDataTool.getDataById("_table_head_icon_icon", skillId);

    //是否处于技能施放中
    this._isInUsing = false;
    //技能施放剩余时间
    this._inUsingSurplusTime = 0;

    this._automaticType = g_AUTOMATIC_TYPE_OBJ.TYPE_1;

    //定时更新函数
    this.update = function (time, personData) {
        //这边更新技能时间
        this._skillSurplusTime = this._skillSurplusTime - time;
        if (this._inUsingSurplusTime <= time) {
            //默认规定是同时只能吟唱一个技能
            personData._b_isInUsing = false;
            this._inUsingSurplusTime = 0;
        } else {
            this._inUsingSurplusTime = this._inUsingSurplusTime - time;
        }
        if (this._skillSurplusTime <= 0) {
            this._skillSurplusTime = 0;
            //判断要不要执行技能
            if (personData._b_isInControl) {
                return;
            }
            if (personData._b_isInUsing) {
                return;
            }
            let attackPersonData = SkillControl.judgeUseSkill(this, personData);
            if (attackPersonData) {
                this.useSkill(personData, attackPersonData);
                this._skillSurplusTime = this._skillTime;
            } else {
                //不行的话就移动
                personData.move();
            }
        }
    };

    this.useSkill = function (personData, attackPersonData) {
        //播放动画
        if (personData._b_node.getChildByName('Role').getComponent(sp.Skeleton).animation !== "attack_1") {
            personData._b_node.getChildByName('Role').getComponent(sp.Skeleton).animation = "attack_1";
        }
        let hurtResultData = local.getHurtNum(personData, attackPersonData, g_ATTACK_TYPE_PHY);
        if (!hurtResultData.type) {
            g_LogTool.showLog(`${personData._r_unitName}攻击${attackPersonData._r_unitName}造成伤害${hurtResultData.num}`);
        } else if (hurtResultData.type === g_HURT_RESULT_MISS) {
            g_LogTool.showLog(`${personData._r_unitName}攻击${attackPersonData._r_unitName}未命中`);
        } else if (hurtResultData.type === g_HURT_RESULT_STRIKE) {
            g_LogTool.showLog(`${personData._r_unitName}攻击${attackPersonData._r_unitName}造成暴击伤害${hurtResultData.num}`);
        }
        attackPersonData.beHurtCb(this, hurtResultData.num, personData);
    };
};

module.exports = outModule;
