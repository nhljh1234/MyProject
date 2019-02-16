import { MyGame } from "../../Tool/System/Game";
import { PersonBattle } from "../../Data/PersonBattleFactory";
import { Person } from "../../Data/Person/PersonFactory";
import { BasePerson } from "../../Data/Person/BasePersonFactory";

/**
 * 大地图随机事件
 */
let eventFuncObj: { [key: string]: Function } = {};

eventFuncObj.battle = function (personData, dataArr) {
    new PersonBattle(personData, new Person(dataArr[0], undefined, undefined, undefined));
};

//判断会不会有随机事件
export function judgeMapRandomEvent (personData: BasePerson) {
    if (Math.random() >= (MyGame.MAP_RANDOM_EVENT_RECORD / 100)) {
        return;
    }
    let mapRandomEventData = MyGame.JsonDataTool.getTableByName('_table_event_mapRandomEvent');
    let mapRandomEventArr = mapRandomEventData ? mapRandomEventData.array : [];
    let i, len;
    for (i = 0, len = mapRandomEventArr.length; i < len; i++) {
        let randomNum = mapRandomEventArr[i].randomNum / 100;
        if (Math.random() < randomNum) {
            //触发
            if (eventFuncObj[mapRandomEventArr[i].type]) {
                eventFuncObj[mapRandomEventArr[i].type](personData, ('' + mapRandomEventArr[i].num).split(','));
                personData.mapRandomEventCb();
                MyGame.LogTool.showLog(`${personData.name} meet event ${mapRandomEventArr[i].name}`);
                return true;
            }
        }
    }
    return false;
};