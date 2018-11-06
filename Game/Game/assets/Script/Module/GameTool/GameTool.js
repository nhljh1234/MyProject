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
 */
outModule.getNearBuildingCity = (buildingId, nowCityId, nowCityData) => {
    nowCityData = nowCityData || g_GameGlobalManager.gameData.getCityById(nowCityId);
    if (cityData.getBuildingById(buildingId)) {
        return nowCityData;
    } 
    let hasBuildingCityArr = g_GameGlobalManager.gameData._allCityArr.filter((oneCityData) => {
        return oneCityData.getBuildingById(buildingId);
    });
    let i, len, minDis = 0, dis, returnCityData;
    for (i = 0, len = hasBuildingCityArr.length; i < len; i++) {
        let cityData = hasBuildingCityArr[i];
        dis = (cityData._cityPos[0] - nowCityData._cityPos[0]) * (cityData._cityPos[0] - nowCityData._cityPos[0]) +
            (cityData._cityPos[1] - nowCityData._cityPos[1]) * (cityData._cityPos[1] - nowCityData._cityPos[1]);
        if (!minDis || minDis > dis) {
            minDis = dis;
            returnCityData = cityData;
        }
    }
    return returnCityData;
};

module.exports = outModule;