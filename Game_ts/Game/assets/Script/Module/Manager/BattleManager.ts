import { Person } from "../../Data/Person/PersonFactory";
import { MyGame } from "../../Tool/System/Game";
import { PersonBattle } from "../../Data/PersonBattleFactory";

/**
 * 战斗管理器
 */

let timeSave: number = 0;
let battleArr: PersonBattle[] = [];

export function startBattle (person_1: Person, person_2: Person) {
    person_1.startBattleCb();
    person_2.startBattleCb();
    let battle = new PersonBattle(person_1, person_2);
    battleArr.push(battle);
};

export function timeUpdate (addMinutes: number) {
    timeSave = timeSave + addMinutes;
    if (timeSave >= MyGame.BATTLE_TIMER_TIME) {
        timeSave = timeSave - MyGame.BATTLE_TIMER_TIME;
        let newArr: PersonBattle[] = [];
        battleArr.forEach(function (oneBattle) {
            let result = oneBattle.timeUpdate();
            if (!result) {
                //表示战斗还没有结束
                newArr.push(oneBattle);
            }
        });
        battleArr = newArr;
    }
};