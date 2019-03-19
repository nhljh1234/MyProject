import { Action } from '../Action/ActionFactory';
import { MyGame } from '../../Tool/System/Game';
import { SelfHome } from '../Building/SelfHome';
import { BasePerson } from './BasePersonFactory';

export interface PersonPos {
    cityId: number;
    buildingId: number;
}

export interface MapPos {
    x: number;
    y: number;
}

export class Person extends BasePerson {
    //收买价格
    price: number;

    constructor(personId: number, saveData: any, cityId: number, randomData: any) {
        super();
        this.isUserRole = false;
        if (saveData) {
            this.initPersonBySave(saveData);
        } else {
            this.initPerson(personId, randomData, cityId);
        }
    }

    private initPerson(personId: number, randomData: any, cityId: number) {
        let jsonData = randomData || MyGame.JsonDataTool.getDataById('person', 'person', personId);
        this.name = jsonData.name;
        this.attack = jsonData.attack;
        this.def = jsonData.def;
        this.command = jsonData.command;
        this.intelligence = jsonData.intelligence;
        this.charm = jsonData.charm;
        this.politics = jsonData.politics;
        this.sex = jsonData.sex;
        this.price = jsonData.price;
        this.presonSkillIdArr = jsonData.personSkillId ? ('' + jsonData.personSkillId).split(',').map(function (idStr) {
            return parseInt(idStr);
        }) : [];
        this.equipAttack = undefined;
        this.equipDef = undefined;
        this.equipJewelry = undefined;
        this.equipHorse = undefined;
        this.personId = MyGame.GameManager.getNewPersonId();
        this.personPos = {
            cityId: cityId || 1,
            buildingId: MyGame.SELF_HOUSE_ID
        }
        this.homePos = cityId || 1;
        this.goalCityMapPos = undefined;
        this.nowMapPos = undefined;
        this.nowActionIds = [];
        this.nowActionData = {};
        this.nowActions = [];
        this.itemObj = {};
        this.money = 0;
        this.power = MyGame.MAX_POWER;
        this.inInBattle = false;
        //自宅
        this.home = new SelfHome(MyGame.SELF_HOUSE_ID, undefined, undefined);
    }

    private initPersonBySave(saveData: any) {
        this.name = saveData.name;
        this.attack = saveData.attack;
        this.def = saveData.def;
        this.command = saveData.command;
        this.intelligence = saveData.intelligence;
        this.charm = saveData.charm;
        this.politics = saveData.politics;
        this.sex = saveData.sex;
        this.price = saveData.price;
        this.presonSkillIdArr = saveData.presonSkillIdArr;
        this.equipAttack = saveData.equipAttack;
        this.equipDef = saveData.equipDef;
        this.equipJewelry = saveData.equipJewelry;
        this.equipHorse = saveData.equipHorse;
        this.personId = saveData.personId;
        this.personPos = saveData.personPos;
        this.homePos = saveData.homePos;
        this.goalCityMapPos = saveData.goalCityMapPos;
        this.nowMapPos = saveData.nowMapPos;
        this.nowActionData = saveData.nowActionData || {};
        this.nowActionIds = saveData.nowActionIds || [];
        this.nowActions = this.nowActionIds.map(function (actionId: number, index: number) {
            return new Action(actionId, undefined, this.nowActionData[index]);
        });
        this.itemObj = saveData.itemObj;
        this.money = saveData.money;
        this.power = saveData.power;
        this.inInBattle = saveData.inInBattle;
        //自宅
        this.home = new SelfHome(MyGame.SELF_HOUSE_ID, undefined, undefined);
    }

    //时间变化函数
    timeUpdate(addMinutes: number) {
        if (this.inInBattle) {
            return;
        }
        this.changeMapPos(this, addMinutes);
        this.timeUpdateAction(addMinutes);
    }
    //日期变化函数
    dayUpdate() {

    }

    //获取存储的数据
    getPersonSaveData() {
        return this.getSaveData();
    }

    //设置
}