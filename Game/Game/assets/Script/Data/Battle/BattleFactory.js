/**
 * 战斗生成工厂
 */
var outModule = {};
var local = {};

/**
 * 生成一个战斗
 * @param {BasePersonClass} person_1
 * @param {BasePersonClass} person_2
 */
outModule.buildOneBattle = function (person_1, person_2) {
    this._person_1 = person_1;
    this._person_2 = person_2;

    /**
     * 返回true表示结束战斗
     */
    this.timeUpdate = function () {
        //战斗开始
        //根据武力计算谁先手
        let attack_1, attack_2;
        attack_1 = this._person_1._attack;
        attack_2 = this._person_2._attack;
        //表示person_1先手攻击
        let isPersonHeadAttack = false;
        //随机先手
        let totalNum = attack_1 + attack_2;
        if (cc.random0To1() < (attack_1 / totalNum)) {
            isPersonHeadAttack = true;
        }
        let hurtNum, personAttack, personDef;
        if (isPersonHeadAttack) {
            personAttack = person_1;
            personDef = person_2; 
        } else {
            personAttack = person_2;
            personDef = person_1; 
        }
        hurtNum = personAttack._attack - personDef._def;
        //伤害量先这么处理
        hurtNum = Math.ceil(hurtNum / 10);
        hurtNum = hurtNum < 0 ? 0 : hurtNum;
        personDef._power = personDef._power - hurtNum;
        if (personDef._power < 0) {
            personDef._power = 0;
            personDef.deadCb(personAttack);
            personDef.battleFinishCb();
            personAttack.battleFinishCb();
            return true;
        }
        hurtNum = personDef._attack - personAttack._def;
        hurtNum = hurtNum < 0 ? 0 : hurtNum;
        personAttack._power = personAttack._power - hurtNum;
        if (personAttack._power < 0) {
            personAttack._power = 0;
            personAttack.deadCb(personDef);
            personAttack.battleFinishCb();
            personDef.battleFinishCb();
            return true;
        }
        return false;
    };
};

module.exports = outModule;