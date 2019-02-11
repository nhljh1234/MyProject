/**
 * 城市数据
 */

import { MyGame } from "../Tool/System/Game";
import { MapPos, Person, createRandomPerson } from "./PersonFactory";
import { Building } from "./Building/BuildingFactory";
import { BuildingShop } from "./Building/ShopFactory";
import { BuildingHospital } from "./Building/HospitalFactory";
import { BuildingPool } from "./Building/PoolFactory";
import { BuildingForest } from "./Building/ForestFactory";
import { BuildingHotel } from "./Building/HotelFactory";
import { BuildingGate } from "./Building/GateFactory";

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

    private initCityBySaveData(saveData: any) {
        this.cityId = saveData.cityId;
        this.peopleNum = saveData.peopleNum;
        this.soldierNum = saveData.soldierNum;
        this.horseNum = saveData.horseNum;
        this.commissariatNum = saveData.commissariatNum;
        this.moneyNum = saveData.moneyNum;
        this.cityDefNum = saveData.cityDefNum;
        let jsonData = MyGame.JsonDataTool.getDataById('_table_city_city', this.cityId);
        this.cityName = jsonData.name;
        this.initBuildingData(this, jsonData);
    }

    private initCity(cityId: number) {
        let jsonData = MyGame.JsonDataTool.getDataById('_table_city_city', cityId);
        this.cityId = cityId;
        this.peopleNum = jsonData.peopleNum;
        this.soldierNum = jsonData.soldierNum;
        this.horseNum = jsonData.horseNum;
        this.commissariatNum = jsonData.commissariatNum;
        this.moneyNum = jsonData.moneyNum;
        this.cityDefNum = jsonData.cityDef;
        this.cityName = jsonData.name;
        this.initBuildingData(this, jsonData);
        //随机人物
        for (let i = 0; i < jsonData.randomNpcNum; i++) {
            this.personArr.push(this.createOneRandomPerson(undefined));
        }
    }

    private initBuildingData(thisData: City, jsonData: any) {
        //城市位置
        this.cityPos = jsonData.cityPos.split(',').map(function (num) {
            return parseInt(num);
        });
        this.cityPos = MyGame.GameTool.buildPos(this.cityPos[0], this.cityPos[1]);
        //人物列表
        this.personArr = ('' + jsonData.npc).split(',').map((personId) => {
            return new Person(parseInt(personId), undefined, this.cityId, undefined);
        });
        //建筑列表
        thisData.buildingArr = ('' + jsonData.building).split(',').map((buildingId) => {
            let useType = MyGame.JsonDataTool.getDataById('_table_building_building', buildingId).useType;
            switch (useType) {
                case MyGame.BUILDING_TYPE_SHOP:
                    return new BuildingShop(parseInt(buildingId), undefined, this);
                case MyGame.BUILDING_TYPE_HOSPITAL:
                    return new BuildingHospital(parseInt(buildingId), undefined, this);
                case MyGame.BUILDING_TYPE_POOL:
                    return new BuildingPool(parseInt(buildingId), undefined, this);
                case MyGame.BUILDING_TYPE_FOREST:
                    return new BuildingForest(parseInt(buildingId), undefined, this);
                case MyGame.BUILDING_TYPE_HOTEL:
                    return new BuildingHotel(parseInt(buildingId), undefined, this);
                case MyGame.BUILDING_FUNCTION_TYPE_TRAVEL:
                    return new BuildingGate(parseInt(buildingId), undefined, this);
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
        sex = sex ? sex : (Math.random() < 0.5 ? MyGame.SEX_MAN : MyGame.SEX_WOMAN);
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