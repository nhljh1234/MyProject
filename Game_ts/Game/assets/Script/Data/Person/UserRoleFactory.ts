import { MyGame } from "../../Tool/System/Game";
import { MapPos, PersonPos, Person } from "./PersonFactory";
import { Action } from "../Action/ActionFactory";
import { SelfHome } from "../Building/SelfHome";
import { City } from "../CityFactory";
import { BasePerson } from "./BasePersonFactory";

/**
 * 获取一个玩家角色的随机数据
 * 性别和名字需要外部传入一个确定值
 */
export function getRandomUserRoleData(sex: number, name: string) {
    var randomData: { [key: string]: any } = {};
    randomData.sex = sex || MyGame.SEX_MAN;
    randomData.name = name || MyGame.RandomNameTool.getRandomName(randomData.sex);
    //随机数据
    randomData.attack = MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 2).num +
        Math.ceil(Math.random() * (100 - MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 2).num));
    randomData.def = MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 3).num +
        Math.ceil(Math.random() * (100 - MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 3).num));
    randomData.command = MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 4).num +
        Math.ceil(Math.random() * (100 - MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 4).num));
    randomData.intelligence = MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 5).num +
        Math.ceil(Math.random() * (100 - MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 5).num));
    randomData.charm = MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 6).num +
        Math.ceil(Math.random() * (100 - MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 6).num));
    randomData.politics = MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 7).num +
        Math.ceil(Math.random() * (100 - MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 7).num));
    randomData.moveSpeed = 5;
    return randomData;
}

export interface updateFuncData {
    func: Function;
    id: number;
    data: any;
}

export class UserRole extends BasePerson {
    //回调列表
    //雇佣列表
    hireIds: number[];
    //仓库属性，这个是只有主角才有的
    warehouseItemObj: { [itemId: number]: number };

    constructor(saveData: any, randomData: any) {
        super();
        this.isUserRole = true;
        if (saveData) {
            this.initUserRoleBySaveData(saveData);
        } else {
            this.initUserRole(randomData);
        }
    }

    private initUserRoleBySaveData(saveData: any) {

    }

    private initUserRole(randomData: any) {
        //名字
        this.name = randomData.name;
        //攻击力
        this.attack = randomData.attack;
        //防御力
        this.def = randomData.def;
        //统帅
        this.command = randomData.command;
        //智力
        this.intelligence = randomData.intelligence;
        //魅力
        this.charm = randomData.charm;
        //政治
        this.politics = randomData.politics;
        //性别
        this.sex = randomData.sex;
        //个人技能
        this.presonSkillIdArr = randomData.presonSkillIdArr ? ('' + randomData.presonSkillIdArr).split(',').map(function (idStr) {
            return parseInt(idStr);
        }) : [];
        //TODO 需要新建一个技能

        //这边是存储的配置
        //武器装备
        this.equipAttack = undefined;
        //防御装备
        this.equipDef = undefined;
        //首饰
        this.equipJewelry = undefined;
        //坐骑
        this.equipHorse = undefined;
        //位置
        //初始都是在家的
        this.personPos = {
            cityId: MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 1).num || 1,
            buildingId: MyGame.SELF_HOUSE_ID
        };
        //家的位置，是一个城市id
        this.homePos = this.personPos.cityId;
        //目的地的大地图坐标
        this.goalCityMapPos = undefined;
        //当前人物所在的大地图坐标
        this.nowMapPos = undefined;
        //目标城市的id
        this.goalCityId = undefined;
        //当前的人物的物品数据
        this.itemObj = {};
        //仓库数据
        this.warehouseItemObj = {};
        //货币数量
        //初始的时候给玩家一点
        this.money = MyGame.JsonDataTool.getDataById('_table_Game_userRandomData', 9).num;
        //体力
        this.power = MyGame.MAX_POWER;
        //是否在战斗中
        //暂定是不记录战斗信息
        this.inInBattle = false;
        //自宅
        this.home = new SelfHome(MyGame.SELF_HOUSE_ID, undefined, undefined);
        //雇佣的人
        this.hireIds = [];
        //正在执行的动作
        this.nowActionIds = [];
        //正在执行的动作缓存的数据
        this.nowActionData = {};
        //正在进行的行动
        this.nowActions = [];
    }

    getRoleSaveData() {
        let saveData = this.getSaveData();
        //补充一下数据
        return saveData;
    }

    /**
     * 时间回调函数
     */
    timeUpdate(addMinutes: number) {
        if (this.inInBattle) {
            return;
        }
        this.changeMapPos(this, addMinutes);
        this.timeUpdateAction(addMinutes);
    }

    /**
     * 雇佣一个人
     * @param personId 
     */
    hirePerson(personId: number) {
        let personData: Person = MyGame.GameManager.gameDataSave.getPersonById(personId);
        if (!personData) {
            MyGame.LogTool.showLog(`hire error! no person!`);
            return;
        }
        if (this.hireIds.indexOf(personId) >= 0) {
            MyGame.LogTool.showLog(`hire error! has hire!`);
            return;
        }
        this.hireIds.push(personId);
        MyGame.EventManager.send(MyGame.EventName.HIRE_PRESON_SUCCESS);
    }
}