/**
 * 代码运行的计时器
 * 计算制定代码段的运行时间，单位是ms
 */

import { MyGame } from "./Game";

/**
 * 记录开始时间
 */
let timeSaveObj: { [key: string]: number } = {};

/**
 * 记录开始的时间
 * @param key
 */
export function recordStartTime(key: any) {
    timeSaveObj[key] = new Date().getTime();
}

/**
 * 打印用时
 * @param key 
 */
export function printUseTime (key: any) {
    if (!timeSaveObj[key]) {
        MyGame.LogTool.showLog(`CodeRunTime printUseTime error !! key is vaild`);
        return;
    }
    MyGame.LogTool.showLog(`${key} use time : ${new Date().getTime() - timeSaveObj[key]}ms`);
    delete timeSaveObj[key];
}