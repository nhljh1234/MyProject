(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Data/Battle/BattleFactory.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bad428xgDhDvbx6I7Uf1Mlc', 'BattleFactory', __filename);
// Script/Data/Battle/BattleFactory.js

"use strict";

/**
 * 战斗生成工厂
 */
var outModule = {};
var local = {};

/**
 * 生成一个战斗
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
        var attack_1 = void 0,
            attack_2 = void 0;
        attack_1 = this._person_1._attack;
        attack_2 = this._person_2._attack;
        //表示person_1先手攻击
        var isPersonHeadAttack = false;
        //随机先手
        var totalNum = attack_1 + attack_2;
        if (cc.random0To1() < attack_1 / totalNum) {
            isPersonHeadAttack = true;
        }
        var hurtNum = void 0,
            personAttack = void 0,
            personDef = void 0;
        if (isPersonHeadAttack) {
            personAttack = person_1;
            personDef = person_2;
        } else {
            personAttack = person_2;
            personDef = person_1;
        }
        hurtNum = personAttack._attack - personDef._def;
        hurtNum = hurtNum < 0 ? 0 : hurtNum;
        personDef._nowHp = personDef._nowHp - hurtNum;
        if (personDef._nowHp < 0) {
            personDef._nowHp = 0;
            personDef.deadCb(personAttack);
            personDef.battleFinishCb();
            personAttack.battleFinishCb();
            return true;
        }
        hurtNum = personDef._attack - personAttack._def;
        hurtNum = hurtNum < 0 ? 0 : hurtNum;
        personAttack._nowHp = personAttack._nowHp - hurtNum;
        if (personAttack._nowHp < 0) {
            personAttack._nowHp = 0;
            personAttack.deadCb(personDef);
            personAttack.battleFinishCb();
            personDef.battleFinishCb();
            return true;
        }
        return false;
    };
};

module.exports = outModule;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=BattleFactory.js.map
        