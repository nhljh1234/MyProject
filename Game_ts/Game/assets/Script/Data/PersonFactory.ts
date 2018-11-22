import { Action } from './ActionFactory';
import { MyGame } from '../Tool/System/Game';

export interface PersonPos {
    cityId: number;
    buildingId: number;
}

export interface MapPos {
    x: number;
    y: number;
}

/**
 * 改变人物大地图上的位置
 */
function changeMapPos(person: Person, addMinutes: number) {
    if (!person.goalCityMapPos) {
        return;
    }
    if (!MyGame.GameTool.judgeEqualPos(person.nowMapPos, person.goalCityMapPos)) {
        //还没有到达目的地
        if (MyGame.MapRandomEvent.judgeMapRandomEvent(person)) {
            return;
        }
        //移动的距离
        let moveNum = Math.ceil((addMinutes / 10) * person.mapMoveSpeed);
        //这边暂时不使用三角函数计算，减少计算量
        let disX = Math.abs(person.goalCityMapPos.x - person.nowMapPos.x);
        let disY = Math.abs(person.goalCityMapPos.y - person.nowMapPos.y);
        let addX = disX / (disX + disY) * moveNum;
        let addY = disY / (disX + disY) * moveNum;
        //x距离增加
        if (person.goalCityMapPos.x !== person.nowMapPos.x) {
            if (person.goalCityMapPos.x > person.nowMapPos.x) {
                person.nowMapPos.x = person.nowMapPos.x + addX;
                if (person.nowMapPos.x >= person.goalCityMapPos.x) {
                    person.nowMapPos.x = person.goalCityMapPos.x;
                }
            } else {
                person.nowMapPos.x = person.nowMapPos.x - addX;
                if (person.nowMapPos.x <= person.goalCityMapPos.x) {
                    person.nowMapPos.x = person.goalCityMapPos.x;
                }
            }
        }
        //y距离增加
        if (person.goalCityMapPos.y !== person.nowMapPos.y) {
            if (person.goalCityMapPos.y > person.nowMapPos.y) {
                person.nowMapPos.y = person.nowMapPos.x + addY;
                if (person.nowMapPos.y >= person.goalCityMapPos.y) {
                    person.nowMapPos.y = person.goalCityMapPos.y;
                }
            } else {
                person.nowMapPos.y = person.nowMapPos.y - addY;
                if (person.nowMapPos.y <= person.goalCityMapPos.y) {
                    person.nowMapPos.y = person.goalCityMapPos.y;
                }
            }
        }
        if (MyGame.GameTool.judgeEqualPos(person.nowMapPos, person.goalCityMapPos)) {
            person.personPos.cityId = person.goalCityId;
            person.nowMapPos = person.goalCityMapPos;
            person.goalCityMapPos = undefined;
            person.goalCityId = undefined;
        }
    }
};

/**
 * 没有任务的时候会去判断下一步应该执行什么任务
 */
function judgeNextAction(person: Person) {
    let actionId: number;
    if (person.power < MyGame.MAX_POWER / 2) {
        //睡觉
        actionId = (cc.random0To1() < 0.5) ? 3 : 4;
    } else {
        actionId = (cc.random0To1() < 0.5) ? 1 : 2;
    }
    return new Action(actionId, undefined);
};

export class Person {
    //行动id
    name: string;
    //攻击力
    attack: number;
    //防御力
    def: number;
    //统率
    command: number;
    //智力
    intelligence: number;
    //魅力
    charm: number;
    //政治
    politics: number;
    //性别
    sex: number;
    //地图移动速度
    mapMoveSpeed: number;
    //个人技能
    presonSkillIdArr: number[];
    //战争技能
    battleSkillIdArr: number[];
    //武器装备
    equipAttack: number;
    //防御装备
    equipDef: number;
    //首饰
    equipJewelry: number;
    //坐骑
    equipHorse: number;
    //唯一id
    personId: number;
    //位置
    personPos: PersonPos;
    //家的位置
    //就是一个城市id
    homePos: number;
    //大地图移动的目的地的位置
    goalCityMapPos: MapPos;
    //现在在大地图上的位置
    nowMapPos: MapPos;
    //大地图移动的目的地
    goalCityId: number;
    //当前执行的任务
    nowAction: Action;
    //当前的人物的物品数据
    //物品id -> 物品数量
    itemObj: { [itemId: number]: number };
    //装备数据
    equipObj: { [equipId: number]: number };
    //货币输了
    money: number;
    //体力
    power: number;
    //是否在战斗中
    //暂定是不记录战斗信息
    inInBattle: boolean;

    constructor(personId: number, saveData: any, cityId: number, randomData: any) {
        if (saveData) {
            this.initpersonBySave(saveData);
        } else {
            this.initperson(personId, randomData, cityId);
        }
    }

    initperson(personId: number, randomData: any, cityId: number) {
        let jsonData = randomData || MyGame.JsonDataTool.getDataById('_table_person_person', personId);
        this.name = jsonData.name;
        this.attack = jsonData.attack;
        this.def = jsonData.def;
        this.command = jsonData.command;
        this.intelligence = jsonData.intelligence;
        this.charm = jsonData.charm;
        this.politics = jsonData.politics;
        this.sex = jsonData.sex;
        this.mapMoveSpeed = jsonData.moveSpeed;
        this.presonSkillIdArr = jsonData.personSkillId ? ('' + jsonData.personSkillId).split(',').map(function (idStr) {
            return parseInt(idStr);
        }) : [];
        this.battleSkillIdArr = jsonData.battleSkillId ? ('' + jsonData.battleSkillId).split(',').map(function (idStr) {
            return parseInt(idStr);
        }) : [];
        this.equipAttack = undefined;
        this.equipDef = undefined;
        this.equipJewelry = undefined;
        this.equipHorse = undefined;
        this.personId = MyGame.GameManager.getNewPersonId();
        this.personPos = {
            cityId: cityId || 1,
            buildingId: -1
        }
        this.homePos = cityId || 1;
        this.goalCityMapPos = undefined;
        this.nowMapPos = undefined;
        this.nowAction = undefined;
        this.itemObj = {};
        this.equipObj = {};
        this.money = 0;
        this.power = MyGame.MAX_POWER;
        this.inInBattle = false;
    }

    initpersonBySave(saveData: any) {
        this.name = saveData.name;
        this.attack = saveData.attack;
        this.def = saveData.def;
        this.command = saveData.command;
        this.intelligence = saveData.intelligence;
        this.charm = saveData.charm;
        this.politics = saveData.politics;
        this.sex = saveData.sex;
        this.mapMoveSpeed = saveData.mapMoveSpeed;
        this.presonSkillIdArr = saveData.presonSkillIdArr;
        this.battleSkillIdArr = saveData.battleSkillIdArr;
        this.equipAttack = saveData.equipAttack;
        this.equipDef = saveData.equipDef;
        this.equipJewelry = saveData.equipJewelry;
        this.equipHorse = saveData.equipHorse;
        this.personId = saveData.personId;
        this.personPos = saveData.personPos;
        this.homePos = saveData.homePos;
        this.goalCityMapPos = saveData.goalCityMapPos;
        this.nowMapPos = saveData.nowMapPos;
        this.nowAction = saveData.nowAction ? new Action(undefined, saveData.nowAction) : undefined;
        this.itemObj = saveData.itemObj;
        this.equipObj = saveData.equipObj;
        this.money = saveData.money;
        this.power = saveData.power;
        this.inInBattle = saveData.inInBattle;
    }

    goToCity(cityId: number) {
        if (this.inInBattle) {
            return;
        }
        let cityMapPos = MyGame.GameManager.gameData.getCityById(cityId).cityPos;
        if (MyGame.GameTool.judgeEqualPos(cityMapPos, this.goalCityMapPos)) {
            //修正一下
            this.personPos.cityId = cityId;
            return;
        }
        //TODO 改变目的地，这个距离会在时间更新处进行计算
        this.goalCityMapPos = cityMapPos;
        this.goalCityId = cityId;
        //如果当前有大地图坐标的话就以这个数据为出发点，否则使用当前城市的大地图坐标为出发点
        if (this.personPos.cityId !== -1) {
            this.nowMapPos = MyGame.GameManager.gameData.getCityById(this.personPos.cityId).cityPos;
        }
        //立马出城
        this.personPos.cityId = -1;
    }
    //前往一个设施
    goToBuilding(buildingId: number) {
        if (this.inInBattle) {
            return;
        }
        if (buildingId === -1) {
            //自宅
            if (this.personPos.cityId === this.homePos) {
                this.personPos.buildingId = buildingId;
                return;
            }
        }
        let nearCityData = MyGame.GameTool.getNearBuildingCity(buildingId, this.personPos.cityId, undefined, this);
        if (nearCityData.id !== this.personPos.cityId) {
            this.goToCity(nearCityData.id);
            return;
        }
        //城市内的建筑是立马到达的
        this.personPos.buildingId = buildingId;
    }
    //任务完成的回调
    actionFinishCb(action: Action) {
        //表示任务执行完了
        this.nowAction = undefined;
        this.getItem(action.rewardArr);
        //TODO 要不要修改成实时的改变，中间人物可以停止
        this.power = this.power - action.costPower;
        this.money = this.money - action.costMoney || 0;
        if (this.power < 0) {
            this.power = 0;
            MyGame.LogTool.showLog(`${this.name} power error, action is ${this.name}`);
        }
        if (this.money < 0) {
            this.money = 0;
            MyGame.LogTool.showLog(`${this.name} money error, action is ${action.actionName}`);
        }
    }
    //获得了物品
    getItem(rewardArr: number[]) {
        let i;
        for (i = 0; i < rewardArr.length; i++) {
            let id = rewardArr[i];
            let num = rewardArr[i + 1];
            if (!this.itemObj[id]) {
                this.itemObj[id] = 0;
            }
            this.itemObj[id] = this.itemObj[id] + num;
            i++;
        }
    }
    //时间变化函数
    timeUpdate = function (addMinutes: number) {
        if (this.inInBattle) {
            return;
        }
        if (this.nowAction) {
            //执行动作
            MyGame.LogTool.showLog(`${this.name} 正在执行 ${this.nowAction.name}`);
            if (this.nowAction.doAction(this)) {
                this.nowAction.timeUpdate(this, addMinutes);
            }
        } else {
            this.nowAction = judgeNextAction(this);
            MyGame.LogTool.showLog(`${this.name} 开始执行 ${this.nowAction.name}`);
            if (this.nowAction.doAction(this)) {
                this.nowAction.timeUpdate(this, addMinutes);
            }
        }
        changeMapPos(this, addMinutes);
    }
    //日期变化函数
    dayUpdate() {

    }
    /**
     * 移除一个物品
     * @param itemId 物品id
     * @param removeNum 移除数量
     */
    removeItemByItemId(itemId: number, removeNum: number) {
        if (this.itemObj[itemId]) {
            this.itemObj[itemId] = this.itemObj[itemId] - removeNum;
            if (this.itemObj[itemId] < 0) {
                MyGame.LogTool.showLog(`removeItemByItemId error ! removeNum is ${removeNum} , nowNum is ${this.itemObj[itemId]}`);
                this.itemObj[itemId] = 0;
            }
        }
    }
    //出售指定id的商品，没有指定数量的话的话表示全部
    //TODO
    sellGood(itemId: number, num: number) {

    }
    //获取存储的数据
    getSaveData() {
        return {
            name: this.name,
            attack: this.attack,
            def: this.def,
            command: this.command,
            intelligence: this.intelligence,
            charm: this.charm,
            politics: this.politics,
            sex: this.sex,
            mapMoveSpeed: this.mapMoveSpeed,
            presonSkillIdArr: this.presonSkillIdArr,
            battleSkillIdArr: this.battleSkillIdArr,
            equipAttack: this.equipAttack,
            equipDef: this.equipDef,
            equipJewelry: this.equipJewelry,
            equipHorse: this.equipHorse,
            personId: this.personId,
            personPos: this.personPos,
            homePos: this.homePos,
            goalCityMapPos: this.goalCityMapPos,
            nowMapPos: this.nowMapPos,
            goalCityId: this.goalCityId,
            nowAction: this.nowAction ? this.nowAction.getSaveData() : undefined,
            itemObj: this.itemObj,
            equipObj: this.equipObj,
            money: this.money,
            power: this.power,
            inInBattle: this.inInBattle
        }
    }
    //死亡回调
    /**
     * @param personAttack 击杀者
     */
    deadCb(personAttack: Person) {
        MyGame.LogTool.showLog(`${personAttack.name} 击杀了 ${this.name}`);
    }
    //开始战斗的回调
    startBattleCb() {
        this.inInBattle = true;
    }
    //战斗结束回调
    battleFinishCb() {
        if (this.power < MyGame.MIN_POWER_NUM) {
            this.treat();
        }
        this.inInBattle = false;
    }
    //回复血量
    treat () {
        for (var key in this.itemObj) {
            if (!this.itemObj.hasOwnProperty(key)) {
                continue;
            }
            if (MyGame.ItemModule.judgeHaveFunctionByName(parseInt(key), MyGame.ITEM_FUNCTION_TYPE_TREAT)) {
                //有这个功能就开始使用
                while (this.itemObj[key] >= 0 && this.power < MyGame.MAX_POWER) {
                    //一直使用
                    let useNum = MyGame.ItemModule.getTreatItemUseNum(this, this.itemObj[key]);

                }
            }
        }
        if (this.power < MyGame.MIN_POWER_NUM) {
            //这个时候增加一个医馆行动
            let action = new Action(6, undefined);
            if (action.costMoney > this.money) {
                this.nowAction = new Action(4, undefined);
            } else {
                this.nowAction = action;
            }
        } else {
            MyGame.LogTool.showLog(`${this.name} 使用食物治疗结束`);
        }
    }
    //触发大地图随机事件
    mapRandomEventCb = function () {

    }
    //使用自宅
    useHome = function () {
        this.power = MyGame.MAX_POWER;
        MyGame.LogTool.showLog(`${this.name} 在家休息结束`);
    }
}

/**
 * 新建一个随机人物
 * @param sex 性别，默认男性
 * @param cityId 家的地址
 */
export function createRandomPerson(sex: number, cityId: number) {
    var randomData: { [key: string]: any } = {};
    //默认是男性
    randomData.sex = sex || MyGame.SEX_MAN;
    randomData.name = MyGame.RandomNameTool.getRandomName(randomData.sex);
    //随机数据
    randomData.attack = 40 + Math.ceil(cc.random0To1() * 60);
    randomData.def = 40 + Math.ceil(cc.random0To1() * 60);
    randomData.command = 40 + Math.ceil(cc.random0To1() * 60);
    randomData.intelligence = 40 + Math.ceil(cc.random0To1() * 60);
    randomData.charm = 40 + Math.ceil(cc.random0To1() * 60);
    randomData.politics = 40 + Math.ceil(cc.random0To1() * 60);
    randomData.hp = 600 + Math.ceil(cc.random0To1() * 400);
    randomData.moveSpeed = 5;
    return new Person(undefined, undefined, cityId, randomData);
};