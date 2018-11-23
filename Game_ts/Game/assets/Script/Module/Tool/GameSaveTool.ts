import { MyGame } from "../../Tool/System/Game";
import { Game } from "../../Data/GameFactory";

//记住，有一个是自动的存储位置
//提供给玩家的存储位置是10个
export const MAX_SAVE_NUM = 10;

/**
 * 获取游戏存储的对象
 * @param index 存储的index
 */
function getSaveData(index: number) {
    let jsonStr = index ? cc.sys.localStorage.getItem(`game_save_${index}`) : cc.sys.localStorage.getItem('auto_save');
    return JSON.parse(jsonStr);
};

/**
 * 保存游戏
 * @param index 存储的index，不传表示自动存储
 */
function saveGameData(index: number, jsonData: any) {
    //存成一个json数据
    if (index) {
        if (index > MAX_SAVE_NUM) {
            return;
        }
        cc.sys.localStorage.setItem(`game_save_${index}`, JSON.stringify(jsonData));
    } else {
        cc.sys.localStorage.setItem('auto_save', JSON.stringify(jsonData));
    }
};

/**
 * 储存游戏数据
 */
export function saveGame() {
    return;
    let gameData = MyGame.GameManager.gameDataSave;
    saveGameData(undefined, gameData.getSaveJsonData());
};

/**
 * 使用存档
 * 会返回一个是否存在存档
 */
export function useGameSaveData(): boolean {
    let saveData = getSaveData(undefined);
    if (!saveData) {
        return false;
    }
    MyGame.GameManager.gameDataSave = new Game(saveData, undefined, undefined);
    MyGame.GameManager.gameDataSave.setGameData(saveData);
    return true;
};