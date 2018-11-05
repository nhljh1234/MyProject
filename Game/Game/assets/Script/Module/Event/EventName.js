/**
 * 记录全局的事件名称，方便查阅
 */
var outModule = {};

outModule.WORLD_TIME_CHANGE = 'WORLD_TIME_CHANGE';

//时间变化消息
//小时数变化
outModule.TIME_UPDATE_HOUR = 'TIME_UPDATE_HOUR';
//天变化
outModule.TIME_UPDATE_DAY = 'TIME_UPDATE_DAY';
//月变化
outModule.TIME_UPDATE_MONTH = 'TIME_UPDATE_MONTH';
//季节变化
outModule.TIME_UPDATE_SEASON = 'TIME_UPDATE_SEASON';
//年变化
outModule.TIME_UPDATE_YEAR = 'TIME_UPDATE_YEAR';

module.exports = outModule;