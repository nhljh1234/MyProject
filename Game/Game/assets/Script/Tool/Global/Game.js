/*global module, require, cc, client */
/**
 * @desc 全局模块
 * @author Administrator
 */
window.g_GAME_SCENE_UI_NODE = 1;
window.g_GAME_SCENE_ALERT_NODE = 2;
window.g_GAME_SCENE_NET_NODE = 3;

window.g_LanguageType = {};
window.g_LanguageType.CHS = 'CHS';
window.g_LanguageType.EN = 'EN';

//这边开始判断是哪个语言
window.g_LanguageTypeSelect = window.g_LanguageType.CHS;
window.g_LanguageObj = require(`Language_${window.g_LanguageTypeSelect}`);

window.g_LanguageTool = require('LanguageTool');
window.g_PrefabManager = require('PrefabManager');
window.g_GameSceneManager = require('GameSceneManager');
window.g_ScrollViewTool = require('ScrollViewTool');
window.g_LogTool = require('LogTool');
window.g_SpriteFrameManager = require('SpriteFrameManager');
window.g_JsonDataTool = require('JsonDataTool');

//主场景相关结点缓存
window.g_GameScene = {};
window.g_GameScene.UINode = undefined;
window.g_GameScene.AlertNode = undefined;
window.g_GameScene.NetNode = undefined;

//自动技能的选项
window.g_AUTOMATIC_TYPE_OBJ = {};
window.g_AUTOMATIC_TYPE_OBJ.TYPE_1 = "TYPE_1";

//战斗场景的定时器间隔
window.g_BATTLE_TIMER_TIME = 0.01;

var outModule = {};

outModule.init = function (oneTaskFinishCb, finishCb) {
    let finishNum = 0;
    const TASK_NUM = 3;
    window.g_PrefabManager.init(() => {
        finishNum++;
        if (finishNum === TASK_NUM && finishCb) {
            finishCb();
        }
        if (oneTaskFinishCb) {
            oneTaskFinishCb(finishNum / TASK_NUM);
        }
    });
    window.g_SpriteFrameManager.init(() => {
        finishNum++;
        if (finishNum === TASK_NUM && finishCb) {
            finishCb();
        }
        if (oneTaskFinishCb) {
            oneTaskFinishCb(finishNum / TASK_NUM);
        }
    });
    window.g_JsonDataTool.init(() => {
        finishNum++;
        if (finishNum === TASK_NUM && finishCb) {
            finishCb();
        }
        if (oneTaskFinishCb) {
            oneTaskFinishCb(finishNum / TASK_NUM);
        }
    });
};

module.exports = outModule;