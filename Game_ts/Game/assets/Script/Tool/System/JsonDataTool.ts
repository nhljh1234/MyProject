import { MyGame } from "./Game";

//以名字来做key
//存储的是json数据
let localJsonDataSave: { [fileName: string]: any } = {};
//快速查询表
let quickSearchDataSave: { [fileName: string]: any } = {};


function getTableName(fileName: string, sheetName: string) {
    return `_table_${fileName}_${sheetName}`;
};

function getQuickSearchTableName(fileName: string, sheetName: string, key: string) {
    return `_table_${fileName}_${sheetName}_${key}`;
};

function getQuickSearchTableByName(fileName: string, sheetName: string, key: string) {
    return quickSearchDataSave[getQuickSearchTableName(fileName, sheetName, key)];
};

function getJsonDataByKey(fileName: string, sheetName: string, key: string, value: any) {
    let table = getTableByName(fileName, sheetName);
    let arrs = [];
    for (var k in table) {
        if (table[k][key] && table[k][key] === value) {
            arrs.push(table[k]);
        }
    }
    return arrs;
};

//建立快速搜索表
function buildQuickSearchTable(fileName: string, sheetName: string, key: string) {
    let table = getTableByName(fileName, sheetName);
    let tableName = getQuickSearchTableName(fileName, sheetName, key);
    for (var k in table) {
        if (table[k][key]) {
            if (!quickSearchDataSave[tableName]) {
                quickSearchDataSave[tableName] = {};
            }
            if (!quickSearchDataSave[tableName][table[k][key]]) {
                quickSearchDataSave[tableName][table[k][key]] = [];
            }
            quickSearchDataSave[tableName][table[k][key]].push(table[k]);
        }
    }
};

/**
 * 返回一个指定的数据表
 * @param {String} tableName 
 */
export function getTableByName(fileName: string, sheetName: string) {
    return localJsonDataSave[getTableName(fileName, sheetName)];
};

/**
 * 返回一个指定的数据表的数组格式
 * @param {String} tableName 
 */
export function getTableArrByName(fileName: string, sheetName: string) {
    let table = getTableByName(fileName, sheetName);
    if (table) {
        let datas = [];
        for (var key in table) {
            datas.push(table[key]);
        }
        return datas;
    }
    return [];
};

/**
 * 异步加载
 * @param {Function} finishCb 
 */
export function init(finishCb: Function) {
    cc.loader.loadResDir('Excel_Data', function (err, objects: cc.JsonAsset[], urls) {
        urls.forEach(function (oneUrl, index) {
            oneUrl = oneUrl.replace("Excel_Data/", "");
            localJsonDataSave[oneUrl] = objects[index].json;
        });
        if (finishCb) {
            finishCb();
        }
    });
};

/**
 * 返回一个指定id的数据
 * @param {String} tableName 
 * @param {Number} id 
 */
export function getDataById(fileName: string, sheetName: string, id: any) {
    let table = getTableByName(fileName, sheetName);
    if (table) {
        return table[id];
    }
    return undefined;
};

/**
 * 根据一个key值来获取数据，返回一个数组
 * @param {String} fileName 
 * @param {String} sheetName 
 * @param {String} key 
 * @param {Number | String} value 
 */
export function getDataByKey(fileName: string, sheetName: string, key: string, value: any, buildQuickFlag: boolean) {
    let table = getQuickSearchTableByName(fileName, sheetName, key);
    if (table[value]) {
        return table[value];
    }
    if (buildQuickFlag) {
        buildQuickSearchTable(fileName, sheetName, key);
        table = getQuickSearchTableByName(fileName, sheetName, key);
        return table[value] || [];
    } else {
        return getJsonDataByKey(fileName, sheetName, key, value);
    }
};