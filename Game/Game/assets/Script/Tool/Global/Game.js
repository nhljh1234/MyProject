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

//多语言工具
window.g_LanguageTool = require('LanguageTool');
//预制件加载工具
window.g_PrefabManager = require('PrefabManager');
//动态场景管理工具
window.g_GameSceneManager = require('GameSceneManager');
//滑动列表工具
window.g_ScrollViewTool = require('ScrollViewTool');
//日志工具
window.g_LogTool = require('LogTool');
//图集管理工具
window.g_SpriteFrameManager = require('SpriteFrameManager');
//Json数据管理工具
window.g_JsonDataTool = require('JsonDataTool');
//客户端事件工具
window.g_EventManager = require('EventManager');

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

//物理攻击
window.g_ATTACK_TYPE_PHY = 1;
//魔法攻击
window.g_ATTACK_TYPE_MAGIC = 2;

window.g_HURT_RESULT_MISS = 1;
window.g_HURT_RESULT_STRIKE = 2;

var outModule = {};

/**
 * 初始化的时候加载所有需要的数据
 * @param {Function} oneTaskFinishCb 完成一个任务的回调
 * @param {Function} finishCb 所有数据加载完成的回调
 */
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