import { Action } from './ActionFactory';
import { MyGame } from '../Tool/System/Game';
import { SelfHome } from './Building/SelfHome';

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
function judgeNextAction(person: Person): Action {
    let actionId: number;
    if (person.power < MyGame.MAX_POWER / 2) {
        //睡觉
        actionId = (Math.random() < 0.5) ? 3 : 4;
    } else {
        if (person.getItemTotalNum() > MyGame.MAX_ITEM_NUM) {
            actionId = 5;
        } else {
            actionId = (Math.random() < 0.5) ? 1 : 2;
        }
    }
    return new Action(actionId, undefined);
};

export class Person {
    //任务姓名
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
    //自宅
    home: SelfHome;

    constructor(personId: number, saveData: any, cityId: number, randomData: any) {
        if (saveData) {
            this.initpersonBySave(saveData);
        } else {
            this.initperson(personId, randomData, cityId);
        }
    }

    private initperson(personId: number, randomData: any, cityId: number) {
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
            buildingId: MyGame.SELF_HOUSE_ID
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
        //自宅
        this.home = new SelfHome(MyGame.SELF_HOUSE_ID, undefined, undefined);
    }

    private initpersonBySave(saveData: any) {
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
        //自宅
        this.home = new SelfHome(MyGame.SELF_HOUSE_ID, undefined, undefined);
    }

    goToCity(cityId: number) {
        if (this.inInBattle) {
            return;
        }
        let cityMapPos = MyGame.GameManager.gameDataSave.getCityById(cityId).cityPos;
        if (MyGame.GameTool.judgeEqualPos(cityMapPos, this.goalCityMapPos)) {
            //修正一下
            this.personPos.cityId = cityId;
            return;
        }
        //TODO 改变目的地，这个距离会在时间更新处进行计算
        this.goalCityMapPos = cityMapPos;
        this.goalCityId = cityId;
        //如果当前有大地图坐标的话就以这个数据为出发点，否则使用当前城市的大地图坐标为出发点
        if (this.personPos.cityId !== MyGame.USER_IN_FIELD) {
            this.nowMapPos = MyGame.GameManager.gameDataSave.getCityById(this.personPos.cityId).cityPos;
        }
        //立马出城
        this.personPos.cityId = MyGame.USER_IN_FIELD;
    }
    //前往一个设施
    goToBuilding(buildingId: number) {
        if (this.inInBattle) {
            return;
        }
        if (buildingId === MyGame.SELF_HOUSE_ID) {
            //自宅
            if (this.personPos.cityId === this.homePos) {
                this.personPos.buildingId = buildingId;
                return;
            }
        }
        let nearCityData = MyGame.GameTool.getNearBuildingCity(buildingId, this.personPos.cityId, undefined, this);
        if (nearCityData.cityId !== this.personPos.cityId) {
            this.goToCity(nearCityData.cityId);
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
        this.changePowerNum(-1 * action.costPower);
        this.changeMoneyNum(-1 * (action.costMoney || 0));
        if (this.power < 0) {
            this.setPowerNum(0);
            MyGame.LogTool.showLog(`${this.name} power error, action is ${this.name}`);
        }
        if (this.money < 0) {
            this.setMoneyNum(0);
            MyGame.LogTool.showLog(`${this.name} money error, action is ${action.actionName}`);
        }
    }
    //获得了物品
    getItem(rewardArr: number[]) {
        if (rewardArr.length === 0) {
            return;
        }
        if (rewardArr.length % 2 !== 0) {
            MyGame.LogTool.showLog(`奖励列表错误 ${rewardArr}`);
            return;
        }
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
    timeUpdate(addMinutes: number) {
        if (this.inInBattle) {
            return;
        }
        if (this.nowAction) {
            //执行动作
            //MyGame.LogTool.showLog(`${this.name} 正在执行 ${this.nowAction.actionName}`);
            if (this.nowAction.doAction(this)) {
                this.nowAction.timeUpdate(this, addMinutes);
            }
        } else {
            this.nowAction = judgeNextAction(this);
            MyGame.LogTool.showLog(`${this.name} 开始执行 ${this.nowAction.actionName}`);
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
            this.rest();
        }
        this.inInBattle = false;
    }
    //回复血量
    rest() {
        for (var key in this.itemObj) {
            if (!this.itemObj.hasOwnProperty(key)) {
                continue;
            }
            if (MyGame.ItemModule.judgeHaveFunctionByName(parseInt(key), MyGame.ITEM_FUNCTION_TYPE_REST)) {
                //有这个功能就开始使用
                //TODO 重写治疗相关
                while (this.itemObj[key] >= 0 && this.power < MyGame.MAX_POWER) {
                    //一直使用
                    let useNum = MyGame.ItemModule.getRestItemUseNum(this, this.itemObj[key]);
                    MyGame.ItemModule.useItem(this, parseInt(key), useNum);
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
    mapRandomEventCb() {

    }

    getItemTotalNum(): number {
        let totalNum = 0;
        for (var key in this.itemObj) {
            if (!this.itemObj.hasOwnProperty(key)) {
                continue;
            }
            totalNum = totalNum + this.itemObj[key];
        }
        return totalNum;
    }

    /**
     * 改变金钱数量
     * @param changeMoneyNum 改变金钱数量
     */
    changeMoneyNum(changeMoneyNum: number) {
        this.money = this.money + changeMoneyNum;
        MyGame.LogTool.showLog(`money change num is ${changeMoneyNum}`);
    }

    /**
     * 直接设置当前的金钱数量
     * @param newMoneyNum 
     */
    setMoneyNum(newMoneyNum: number) {
        this.money = newMoneyNum;
        MyGame.LogTool.showLog(`money now num is ${newMoneyNum}`);
    }

    /**
     * 改变体力数量
     * @param changePowerNum
     */
    changePowerNum(changePowerNum: number) {
        this.power = this.power + changePowerNum;
        if (this.power > MyGame.MAX_POWER) {
            this.power = MyGame.MAX_POWER;
        } 
        if (this.power < 0) {
            this.power = 0;
        }
        MyGame.LogTool.showLog(`power change num is ${changePowerNum}`);
    }

    /**
     * 直接设置当前的体力数量
     * @param newPowerNum 
     */
    setPowerNum(newPowerNum: number) {
        this.power = newPowerNum;
        if (this.power > MyGame.MAX_POWER) {
            this.power = MyGame.MAX_POWER;
        } 
        if (this.power < 0) {
            this.power = 0;
        }
        MyGame.LogTool.showLog(`power now num is ${newPowerNum}`);
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
    randomData.attack = 40 + Math.ceil(Math.random() * 60);
    randomData.def = 40 + Math.ceil(Math.random() * 60);
    randomData.command = 40 + Math.ceil(Math.random() * 60);
    randomData.intelligence = 40 + Math.ceil(Math.random() * 60);
    randomData.charm = 40 + Math.ceil(Math.random() * 60);
    randomData.politics = 40 + Math.ceil(Math.random() * 60);
    randomData.hp = 600 + Math.ceil(Math.random() * 400);
    randomData.moveSpeed = 5;
    return new Person(undefined, undefined, cityId, randomData);
};