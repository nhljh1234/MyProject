import { MapPos } from "../../Data/PersonFactory";
import { Person } from "../../Data/PersonFactory";
import { MyGame } from "../../Tool/System/Game";

/**
 * 这边封装了很多游戏内用的函数
 */

/**
 * 判断两个二位数组的坐标是否相同
 * @param {MapPos} pos_1
 * @param {MapPos} pos_2
 */
export function judgeEqualPos(pos_1, pos_2) {
    if (!pos_1 || !pos_2) {
        return false;
    }
    return pos_1.x === pos_2.x && pos_1.y === pos_2.y;
};

/**
 * 新建一个二维坐标
 */
export function buildPos(x, y): MapPos {
    return {
        x: x,
        y: y
    }
};

/**
 * 获取一个最近的拥有指定id建筑的城市数据
 * @param buildingId 建筑id
 * @param nowCityId 出发城市id
 * @param nowCityData 出发城市的数据
 * @param personData 
 */
export function getNearBuildingCity(buildingId: number, nowCityId: number, nowCityData, personData: Person) {
    let nowMapPos;
    if (nowCityId === -1) {
        nowMapPos = personData.nowMapPos;
    } else {
        nowCityData = nowCityData || MyGame.GameManager.gameData.getCityById(nowCityId);
        if (nowCityData.getBuildingById(buildingId)) {
            return nowCityData;
        }
        nowMapPos = nowCityData._cityPos;
    }
    if (buildingId === -1) {
        return MyGame.GameManager.gameData.getCityById(personData.homePos);
    }
    let hasBuildingCityArr = MyGame.GameManager.gameData._allCityArr.filter((oneCityData) => {
        return oneCityData.getBuildingById(buildingId);
    });
    let i, len, minDis = -1, dis, returnCityData;
    for (i = 0, len = hasBuildingCityArr.length; i < len; i++) {
        let cityData = hasBuildingCityArr[i];
        dis = (cityData._cityPos.x - nowMapPos.x) * (cityData._cityPos.x - nowMapPos.x) +
            (cityData._cityPos.y - nowMapPos.y) * (cityData._cityPos.y - nowMapPos.y);
        if (minDis === -1 || minDis > dis) {
            minDis = dis;
            returnCityData = cityData;
        }
    }
    return returnCityData;
};

/**
 * 获取两个城市之间的距离
 * @param cityId_1
 * @param cityId_2
 */
export function getCityDis(cityId_1: number, cityId_2: number) {
    let cityData_1, cityData_2;
    cityData_1 = MyGame.GameManager.gameData.getCityById(cityId_1);
    cityData_2 = MyGame.GameManager.gameData.getCityById(cityId_2);
    return Math.sqrt((cityData_1._cityPos.x - cityData_2._cityPos.x) * (cityData_1._cityPos.x - cityData_2._cityPos.x) +
        (cityData_1._cityPos.y - cityData_2._cityPos.y) * (cityData_1._cityPos.y - cityData_2._cityPos.y));
};