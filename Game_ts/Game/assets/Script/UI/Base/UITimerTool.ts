//会在运行的scene场景上的update循环运行这些函数
var updateFuncDataArr: updateFuncData[] = [];

export interface updateFuncData {
    func: Function;
    data: any;
    thisObj: any;
}

function getIndexByFunc(func: Function): number {
    let i: number;
    for (i = 0; i < updateFuncDataArr.length; i++) {
        if (updateFuncDataArr[i].func === func) {
            return i;
        }
    }
    return undefined;
}

export function addUpdateFunc(func: Function, data: any, thisObj: any) {
    let index = getIndexByFunc(func);
    if (index >= 0) {
        return;
    }
    updateFuncDataArr.push({
        func: func,
        data: data,
        thisObj: thisObj
    });
}

export function removeUpdateFunc(func: Function) {
    let index = getIndexByFunc(func);
    if (index >= 0) {
        updateFuncDataArr.splice(index, 0);
    }
}

export function getUpdateFunc(): updateFuncData[] {
    return updateFuncDataArr;
};
