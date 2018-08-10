/*global module, require, cc, client */
/**
 * @desc 全局模块
 * @author Administrator
 */
window.Global = {};

window.Global.GAME_SCENE_UI_NODE = 1;
window.Global.GAME_SCENE_ALERT_NODE = 2;
window.Global.GAME_SCENE_NET_NODE = 3;

window.Global.LanguageType = {};
window.Global.LanguageType.CHS = 'CHS';
window.Global.LanguageType.EN = 'EN';

//这边开始判断是哪个语言
window.Global.LanguageTypeSelect = window.Global.LanguageType.CHS;
window.Global.LanguageObj = require(`Language_${window.Global.LanguageTypeSelect}`);

window.Global.LanguageTool = require('LanguageTool');
window.Global.PrefabManager = require('PrefabManager');
window.Global.GameSceneManager = require('GameSceneManager');
window.Global.ScrollViewTool = require('ScrollViewTool');
window.Global.LogTool = require('LogTool');
window.Global.SpriteFrameManager = require('SpriteFrameManager');