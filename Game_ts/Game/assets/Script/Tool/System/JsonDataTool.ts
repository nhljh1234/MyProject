import { MyGame } from "./Game";

//以名字来做key
//一个key对应一个obj，obj里面有两个属性，一个是object（用对象的方式组织数据），一个是array（用数组的方式实现）
let localJsonDataSave: { [fileName: string]: any } = {};

/**
 * 一般来说数据组成都是mian_id为key，为了减少调用getDataByKey函数的时间，会对指定的表进行处理，按指定的key再生成一遍数据
 * 如会对_table_attribute_attribute表格进行处理，以attributeName为key绑定一个数据
 */
const INTI_DATA_KEY = {
    '_table_attribute_attribute': [
        'attributeName'
    ],
    '_table_unit_unit': [
        'unitType'
    ],
    '_table_item_itemFunction': [
        'type'
    ]
}

/**
 * 异步加载
 * @param {Function} finishCb 
 */
export function init(finishCb: Function) {
    cc.loader.loadResDir('Excel_Data', function (err, objects, urls) {
        urls.forEach(function (oneUrl, index) {
            oneUrl = oneUrl.replace("Excel_Data/", "");
            localJsonDataSave[oneUrl] = objects[index];
            //对INTI_DATA_KEY的数据进行处理
            if (INTI_DATA_KEY[oneUrl]) {
                INTI_DATA_KEY[oneUrl].forEach((keyName) => {
                    localJsonDataSave[oneUrl][keyName] = {};
                    localJsonDataSave[oneUrl].array.forEach((oneData) => {
                        //不是以id为key的情况时可能包括多个
                        if (!localJsonDataSave[oneUrl][keyName][oneData[keyName]]) {
                            localJsonDataSave[oneUrl][keyName][oneData[keyName]] = [];
                        }
                        localJsonDataSave[oneUrl][keyName][oneData[keyName]].push(oneData);
                    });
                });
            }
        });
        if (finishCb) {
            finishCb();
        }
    });
}

/**
 * 根据一个key值来获取数据，返回一个数组
 * @param {String} tableName 
 * @param {String} key 
 * @param {Number | String} value 
 */
export function getDataByKey(tableName: string, key: string, value: any) {
    let table = getTableByName(tableName);
    if (table && table[key]) {
        return table[key][value];
    } else {
        MyGame.LogTool.showLog(`INTI_DATA_KEY not have this key : ${key}`);
    }
    return [];
}

/**
 * 返回一个指定的数据表
 * @param {String} tableName 
 */
export function getTableByName(tableName: string) {
    return localJsonDataSave[tableName];
}

/**
 * 返回一个指定id的数据
 * @param {String} tableName 
 * @param {Number} id 
 */
export function getDataById(tableName: string, id: any) {
    if (localJsonDataSave[tableName]) {
        return localJsonDataSave[tableName].object[id];
    }
    return undefined;
}