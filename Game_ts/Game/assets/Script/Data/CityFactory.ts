import { MyGame } from "../Tool/System/Game";
import { MapPos, Person, createRandomPerson } from "./PersonFactory";
import { Building } from "./Building/BuildingFactory";
import { BuildingShop } from "./Building/ShopFactory";
import { BuildingHospital } from "./Building/HospitalFactory";

export class City {
    //城市id
    cityId: number
    //配置数据
    //居民数量
    peopleNum: number;
    //军队数量
    soldierNum: number;
    //马匹数量
    horseNum: number;
    //粮食数量
    //一个人一天需要消耗1的粮食
    commissariatNum: number;
    //金币数量
    moneyNum: number;
    //城市防御
    cityDefNum: number;
    //城市名字
    cityName: string;
    //城市位置
    cityPos: MapPos;
    //人物列表
    personArr: Person[];
    //建筑列表
    buildingArr: Building[];

    constructor(cityId: number, saveData: any) {
        if (saveData) {
            this.initCityBySaveData(saveData);
        } else {
            this.initCity(cityId);
        }
    }

    initCityBySaveData(saveData: any) {
        this.cityId = saveData.cityId;
        this.peopleNum = saveData.peopleNum;
        this.soldierNum = saveData.soldierNum;
        this.horseNum = saveData.horseNum;
        this.commissariatNum = saveData.commissariatNum;
        this.moneyNum = saveData.moneyNum;
        this.cityDefNum = saveData.cityDefNum;
        let jsonData = MyGame.JsonDataTool.getDataById('_table_city_city', this.cityId);
        this.cityName = jsonData.name;
        //城市位置
        //用两个元素表示，类似于经纬度
        this.cityPos = jsonData.cityPos.split(',').map(function (num) {
            return parseInt(num);
        });
        this.cityPos = MyGame.GameTool.buildPos(this.cityPos[0], this.cityPos[1]);
        //人物列表
        //表示家在这个城市的人
        this.personArr = saveData.personArr.map((personId) => {
            return MyGame.GameManager.gameDataSave.getPersonById(personId);
        });
        //建筑列表
        this.buildingArr = ('' + jsonData.building).split(',').map(function (buildingId) {
            let useType = MyGame.JsonDataTool.getDataById('_table_building_building', buildingId);
            switch (useType) {
                case 'shop':
                    return new BuildingShop(parseInt(buildingId), undefined, this);
                case 'hospital':
                    return new BuildingHospital(parseInt(buildingId), undefined, this);
                default:
                    return new Building(parseInt(buildingId), undefined, this);
            }
        }.bind(this));
    }

    initCity(cityId: number) {
        let jsonData = MyGame.JsonDataTool.getDataById('_table_city_city', cityId);
        this.cityId = cityId;
        this.peopleNum = jsonData.peopleNum;
        this.soldierNum = jsonData.soldierNum;
        this.horseNum = jsonData.horseNum;
        this.commissariatNum = jsonData.commissariatNum;
        this.moneyNum = jsonData.moneyNum;
        this.cityDefNum = jsonData.cityDef;
        this.cityName = jsonData.name;
        //城市位置
        //用两个元素表示，类似于经纬度
        this.cityPos = jsonData.cityPos.split(',').map(function (num) {
            return parseInt(num);
        });
        this.cityPos = MyGame.GameTool.buildPos(this.cityPos[0], this.cityPos[1]);
        //人物列表
        this.personArr = ('' + jsonData.npc).split(',').map((personId) => {
            return new Person(parseInt(personId), undefined, this.cityId, undefined);
        });
        //随机人物
        for (let i = 0; i < jsonData.randomNpcNum; i++) {
            this.personArr.push(this.createOneRandomPerson(undefined));
        }
        //建筑列表
        this.buildingArr = ('' + jsonData.building).split(',').map((buildingId) => {
            let useType = MyGame.JsonDataTool.getDataById('_table_building_building', buildingId);
            switch (useType) {
                case 'shop':
                    return new BuildingShop(parseInt(buildingId), undefined, this);
                case 'hospital':
                    return new BuildingHospital(parseInt(buildingId), undefined, this);
                default:
                    return new Building(parseInt(buildingId), undefined, this);
            }
        });
    }

    getBuildingById(buildingId: number): Building {
        let i: number;
        for (i = 0; i < this.buildingArr.length; i++) {
            if (this.buildingArr[i].buildingId === buildingId) {
                return this.buildingArr[i];
            }
        }
        return undefined;
    }
    //在这个城市新建一个随机人物
    createOneRandomPerson(sex: number) {
        sex = sex ? sex : (cc.random0To1() < 0.5 ? MyGame.SEX_MAN : MyGame.SEX_WOMAN);
        return createRandomPerson(sex, this.cityId);
    }
    //新的一天
    dayUpdate() {
        this.buildingArr.forEach(function (oneBuilding) {
            oneBuilding.dayUpdate();
        });
    }
    getSaveData() {
        return {
            cityId: this.cityId,
            peopleNum: this.peopleNum,
            soldierNum: this.soldierNum,
            horseNum: this.horseNum,
            commissariatNum: this.commissariatNum,
            moneyNum: this.moneyNum,
            cityDefNum: this.cityDefNum,
            personArr: this.personArr.map(function (onePersonData) {
                return onePersonData.personId;
            })
        }
    }
}