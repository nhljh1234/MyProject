import { MyGame } from "../../Tool/System/Game";

//会在运行的scene场景上的update循环运行这些函数
var updateFuncDataArr: updateFuncData[] = [];

export interface updateFuncData {
    func: Function;
    data: any;
    thisObj: any;
}

/**
 * 这边还要判断一下data是否相同
 * @param func 
 */
function getIndexByFunc(func: Function, data: any): number {
    let i: number;
    for (i = 0; i < updateFuncDataArr.length; i++) {
        if (updateFuncDataArr[i].func === func) {
            //判断参数
            if (MyGame.Tool.equal(data, updateFuncDataArr[i].data)) {
                return i;
            }
        }
    }
    return undefined;
}

export function addUpdateFunc(func: Function, data: any, thisObj: any) {
    let index = getIndexByFunc(func, data);
    if (index >= 0) {
        return;
    }
    updateFuncDataArr.push({
        func: func,
        data: data,
        thisObj: thisObj
    });
}

export function removeUpdateFunc(func: Function, data: any) {
    let index = getIndexByFunc(func, data);
    if (index >= 0) {
        updateFuncDataArr.splice(index, 0);
    }
}

export function getUpdateFunc(): updateFuncData[] {
    return updateFuncDataArr;
};
