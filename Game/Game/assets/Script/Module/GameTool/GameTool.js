/**
 * 这边封装了很多游戏内用的函数
 */
var outModule = {};
var local = {};

/**
 * 获取一个最近的拥有指定id建筑的城市数据
 * @param buildingId 建筑id
 * @param nowCityId 出发城市id
 * @param nowCityData 出发城市的数据
 * @param personData 
 */
outModule.getNearBuildingCity = (buildingId, nowCityId, nowCityData, personData) => {
    nowCityData = nowCityData || g_GameGlobalManager.gameData.getCityById(nowCityId);
    if (nowCityData.getBuildingById(buildingId)) {
        return nowCityData;
    }
    if (buildingId === -1) {
        return g_GameGlobalManager.gameData.getCityById(personData._homePos);
    }
    let hasBuildingCityArr = g_GameGlobalManager.gameData._allCityArr.filter((oneCityData) => {
        return oneCityData.getBuildingById(buildingId);
    });
    let i, len, minDis = -1, dis, returnCityData;
    for (i = 0, len = hasBuildingCityArr.length; i < len; i++) {
        let cityData = hasBuildingCityArr[i];
        dis = (cityData._cityPos[0] - nowCityData._cityPos[0]) * (cityData._cityPos[0] - nowCityData._cityPos[0]) +
            (cityData._cityPos[1] - nowCityData._cityPos[1]) * (cityData._cityPos[1] - nowCityData._cityPos[1]);
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
outModule.getCityDis = (cityId_1, cityId_2) => {
    let cityData_1, cityData_2;
    cityData_1 = g_GameGlobalManager.gameData.getCityById(cityId_1);
    cityData_2 = g_GameGlobalManager.gameData.getCityById(cityId_2);
    return Math.sqrt((cityData_1._cityPos[0] - cityData_2._cityPos[0]) * (cityData_1._cityPos[0] - cityData_2._cityPos[0]) +
        (cityData_1._cityPos[1] - cityData_2._cityPos[1]) * (cityData_1._cityPos[1] - cityData_2._cityPos[1]));
};

module.exports = outModule;