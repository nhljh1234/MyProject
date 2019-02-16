import { Person } from "./Person/PersonFactory";

/**
 * 战斗生成工厂
 */

export class PersonBattle {
    person_1: Person;
    person_2: Person;
    constructor(person_1: Person, person_2: Person) {
        this.person_1 = person_1;
        this.person_2 = person_2;
    }

    timeUpdate() {
        //战斗开始
        //根据武力计算谁先手
        let attack_1, attack_2;
        attack_1 = this.person_1.attack;
        attack_2 = this.person_2.attack;
        //表示person_1先手攻击
        let isPersonHeadAttack = false;
        //随机先手
        let totalNum = attack_1 + attack_2;
        if (Math.random() < (attack_1 / totalNum)) {
            isPersonHeadAttack = true;
        }
        let hurtNum, personAttack: Person, personDef: Person;
        if (isPersonHeadAttack) {
            personAttack = this.person_1;
            personDef = this.person_2;
        } else {
            personAttack = this.person_2;
            personDef = this.person_1;
        }
        hurtNum = personAttack.attack - personDef.def;
        //伤害量先这么处理
        hurtNum = Math.ceil(hurtNum / 10);
        hurtNum = hurtNum < 0 ? 0 : hurtNum;
        personDef.changePowerNum(-1 * hurtNum);
        if (personDef.power < 0) {
            personDef.setPowerNum(0);
            personDef.deadCb(personAttack);
            personDef.battleFinishCb();
            personAttack.battleFinishCb();
            return true;
        }
        hurtNum = personDef.attack - personAttack.def;
        hurtNum = hurtNum < 0 ? 0 : hurtNum;
        personAttack.changePowerNum(-1 * hurtNum);
        if (personAttack.power < 0) {
            personAttack.setPowerNum(0);
            personAttack.deadCb(personDef);
            personAttack.battleFinishCb();
            personDef.battleFinishCb();
            return true;
        }
        return false;
    };
}