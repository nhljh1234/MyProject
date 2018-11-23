import { MyGame } from "../Tool/System/Game";
import { City } from "./CityFactory";

/**
 * 割据势力数据工厂
 */

export class Force {
    //势力id
    forceId: number;
    //势力名字
    forceName: string;
    //所属城市列表
    cityArr: City[];

    constructor(forceId: number, saveData: any) {
        if (saveData) {
            this.initForeBySaveData(saveData);
        } else {
            this.initForce(forceId);
        }
    }

    initForeBySaveData(saveData: any) {
        this.forceId = saveData.forceId;
        //配置数据
        let jsonData = MyGame.JsonDataTool.getDataById('_table_force_force', this.forceId);
        //势力名字
        this.forceName = jsonData.name;
        //割据势力所属的城市
        this.cityArr = saveData.cityArr.map((cityId) => {
            return MyGame.GameManager.gameDataSave.getCityById(cityId);
        });
    }

    initForce(forceId: number) {
        let jsonData = MyGame.JsonDataTool.getDataById('_table_force_force', forceId);
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