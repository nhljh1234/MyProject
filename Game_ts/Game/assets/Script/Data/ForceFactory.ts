/**
 * 割据势力数据工厂
 * force.xml
 * _table_force_force.json
 * 一个世界可能存在很多势力，每个势力拥有自己的城市
 */

import { MyGame } from "../Tool/System/Game";
import { City } from "./CityFactory";

export class Force {
    //势力id
    forceId: number;
    //势力名字
    forceName: string;
    //所属城市列表
    cityArr: City[];

    //所有的构造函数都需要考虑存档的问题
    constructor(forceId: number, saveData: any) {
        if (saveData) {
            this.initForeBySaveData(saveData);
        } else {
            this.initForce(forceId);
        }
    }

    private initForeBySaveData(saveData: any) {
        this.forceId = saveData.forceId;
        //配置数据
        let jsonData = MyGame.JsonDataTool.getDataById('force', 'force', this.forceId);
        //势力名字
        this.forceName = jsonData.name;
        //割据势力所属的城市
        this.cityArr = saveData.cityArr.map((cityId) => {
            return MyGame.GameManager.gameDataSave.getCityById(cityId);
        });
    }

    private initForce(forceId: number) {
        let jsonData = MyGame.JsonDataTool.getDataById('force', 'force', forceId);
        this.forceId = forceId;
        this.forceName = jsonData.name;
        this.cityArr = ('' + jsonData.city).split(',').map((cityId) => {
            return new City(parseInt(cityId), undefined);
        });
    }

    getSaveData() {
        return {
            id: this.forceId,
            cityArr: this.cityArr.map(function (oneCityData) {
                return oneCityData.cityId;
            }),
        }
    };
}