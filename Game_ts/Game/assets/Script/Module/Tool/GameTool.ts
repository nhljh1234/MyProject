import { MapPos } from "../../Data/Person/PersonFactory";
import { Person } from "../../Data/Person/PersonFactory";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../../Data/CityFactory";
import { BasePerson } from "../../Data/Person/BasePersonFactory";

/**
 * 这边封装了很多游戏内用的函数
 */

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
    randomData.price = 8000 + Math.ceil(Math.random() * 2000);
    randomData.moveSpeed = 5;
    return new Person(undefined, undefined, cityId, randomData);
};

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
export function getNearBuildingCity(buildingId: number, nowCityId: number, nowCityData: City, personData: BasePerson): City {
    let nowMapPos;
    if (nowCityId === MyGame.USER_IN_FIELD) {
        nowMapPos = personData.nowMapPos;
    } else {
        nowCityData = nowCityData || MyGame.GameManager.gameDataSave.getCityById(nowCityId);
        if (nowCityData.getBuildingById(buildingId)) {
            return nowCityData;
        }
        nowMapPos = nowCityData.cityPos;
    }
    if (buildingId === MyGame.SELF_HOUSE_ID) {
        return MyGame.GameManager.gameDataSave.getCityById(personData.homePos);
    }
    let hasBuildingCityArr = MyGame.GameManager.gameDataSave.allCityArr.filter((oneCityData) => {
        return oneCityData.getBuildingById(buildingId);
    });
    let i, len, minDis = -1, dis, returnCityData;
    for (i = 0, len = hasBuildingCityArr.length; i < len; i++) {
        let cityData = hasBuildingCityArr[i];
        dis = (cityData.cityPos.x - nowMapPos.x) * (cityData.cityPos.x - nowMapPos.x) +
            (cityData.cityPos.y - nowMapPos.y) * (cityData.cityPos.y - nowMapPos.y);
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
    cityData_1 = MyGame.GameManager.gameDataSave.getCityById(cityId_1);
    cityData_2 = MyGame.GameManager.gameDataSave.getCityById(cityId_2);
    return Math.sqrt((cityData_1._cityPos.x - cityData_2._cityPos.x) * (cityData_1._cityPos.x - cityData_2._cityPos.x) +
        (cityData_1._cityPos.y - cityData_2._cityPos.y) * (cityData_1._cityPos.y - cityData_2._cityPos.y));
};