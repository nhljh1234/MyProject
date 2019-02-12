import { City } from "../../Data/CityFactory";
import { MyGame } from "../../Tool/System/Game";

/**
 * 获取两个城市旅行需要花费的时间
 */
export function getTravelCostTime(cityId_1: number, cityId_2: number): number {
    let cityData_1: City, cityData_2: City;
    cityData_1 = MyGame.GameManager.gameDataSave.getCityById(cityId_1);
    cityData_2 = MyGame.GameManager.gameDataSave.getCityById(cityId_2);
    let speed = MyGame.MAP_MOVE_SPEED_MINUTE;
    let disX: number, disY: number;
    disX = cityData_1.cityPos.x - cityData_2.cityPos.x;
    disY = cityData_1.cityPos.y - cityData_2.cityPos.y;
    let dis: number = Math.sqrt(disX * disX + disY * disY);
    //距离向上取整
    return Math.ceil(dis / speed);
}