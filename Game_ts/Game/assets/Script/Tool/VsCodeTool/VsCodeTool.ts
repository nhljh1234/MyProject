/**
 * 淘金模式下的JSON数据
 * @param dirPath 文件夹
 */
export function getTJJsonAnnotation(dirPath: string, successCb: Function) {
    cc.loader.loadResDir(dirPath, function (err, jsonDataArr: cc.JsonAsset[], url: string[]) {
        let string = '';
        //处理每个jsonDataArr文件
        jsonDataArr.forEach(function (oneJsonData) {
            for (var key in oneJsonData) {
                if (!oneJsonData.hasOwnProperty(key)) {
                    continue;
                }
                string = string + ` declare interface _table_${key} {\n`;
                //存储字段key和其对应的属性
                let saveObj: { [key: string]: string } = {};
                oneJsonData[key].forEach(function (oneData) {
                    for (var oneKey in oneData) {
                        if (!oneData.hasOwnProperty(oneKey)) {
                            continue;
                        }
                        if (!saveObj[oneKey]) {
                            saveObj[oneKey] = typeof oneData[oneKey];
                        } else if (saveObj[oneKey] && saveObj[oneKey] !== typeof oneData[oneKey]) {
                            saveObj[oneKey] = 'any';
                        }
                    }
                });
                //开始写入数据
                for (var oneKey in saveObj) {
                    if (!saveObj.hasOwnProperty(oneKey)) {
                        continue;
                    }
                    string = string + `  ${oneKey}: ${saveObj[oneKey]};\n`;
                }
                string = string + `}\n`;
            }
        });
        if (successCb) {
            successCb(string);
        }
    });
}

/**
 * 自己游侠模式下的JSON数据
 * @param dirPath 文件夹
 */
export function getJsonAnnotation(successCb: Function) {
    cc.loader.loadResDir("Excel_Data/", function (err, jsonDataArr: cc.JsonAsset[], urls: string[]) {
        let string = '';
        //处理每个jsonDataArr文件
        jsonDataArr.forEach(function (oneJsonData, index) {
            let oneUrl = urls[index].replace("Excel_Data/", "");
            string = string + ` declare interface ${oneUrl} {\n`;
            //存储字段key和其对应的属性
            let saveObj: { [key: string]: string } = {};
            oneJsonData.json.array.forEach(function (oneData) {
                for (var oneKey in oneData) {
                    if (!oneData.hasOwnProperty(oneKey)) {
                        continue;
                    }
                    if (!saveObj[oneKey]) {
                        saveObj[oneKey] = typeof oneData[oneKey];
                    } else if (saveObj[oneKey] && saveObj[oneKey] !== typeof oneData[oneKey]) {
                        saveObj[oneKey] = 'any';
                    }
                }
            });
            //开始写入数据
            for (var oneKey in saveObj) {
                if (!saveObj.hasOwnProperty(oneKey)) {
                    continue;
                }
                string = string + `  ${oneKey}: ${saveObj[oneKey]};\n`;
            }
            string = string + `}\n`;
        });
        if (successCb) {
            successCb(string);
        }
    });
}