declare module BuildingFactory {
	function createOneBuilding();
}
declare module RandomNameTool {
	function initAllNameArr();
	function removeOneName();
	function getRandomName();
}
declare module ActionFactory {
	function createOneAction();
}
declare module SellGoodFactory {
	function createOneSellGood();
}
declare module MapRandomEvent {
	function judgeMapRandomEvent();
}
declare module PersonFactory {
	function createRandomPerson();
	function createOneBasePerson();
}
declare module GlobalData {
	var SEX_MAN;
	var SEX_WOMAN;
	function init();
}
declare module CityFactory {
	function createOneCity();
}
declare module DateTool {
	var SPRING;
	var SUMMER;
	var AUTUMN;
	var WINTER;
	function getIsLeapYear();
	function getNewDate();
	function getTimeStrWithEra();
	function getSeason();
}
declare module EventName {
	var WORLD_TIME_CHANGE;
	var TIME_UPDATE_HOUR;
	var TIME_UPDATE_DAY;
	var TIME_UPDATE_MONTH;
	var TIME_UPDATE_SEASON;
	var TIME_UPDATE_YEAR;
	var USER_ROLE_STATUS_CHANGE;
}
declare module ForceFactory {
	function createOneForce();
}
declare module GameSave {
	var MAX_SAVE_NUM;
	function saveGame();
	function useGameSaveData();
}
declare module BattleFactory {
	function buildOneBattle();
}
declare module Language_CHS {
	var load_load_str;
	var load_game_str;
	var start_battle_str;
	var follow_str;
	var pause;
	var resume;
	var auto;
	var not_auto;
	var returnStr;
	var clear;
	var change;
	var era_name;
	var look;
	var random_user_name;
	var get_random_name;
	var random_user_sex;
	var sex_man;
	var sex_woman;
	var random_name_notice;
	var random_attack_label;
	var random_def_label;
	var random_command_label;
	var random_intelligence_label;
	var random_charm_label;
	var random_politics_label;
	var random_user_num;
	var sure;
}
declare module VsCodeTool {
	function getModuleVsCodeStr();
	function getClassVsCodeStr();
	function getResultStr();
}
declare module LanguageTool {
	function getLanguageStr();
}
declare module PrefabManager {
	var prefabSave;
	function judgeCanClearPrefab();
	function getPrefab();
	function clearAll();
	function clearPrefabWithoutUseSpreite();
	function clearPrefabInStrongMode();
	function clearPrefab();
	function addPrefabNode();
	function init();
	function loadPrefab();
}
declare module GameSceneManager {
	function addNode();
}
declare module ScrollViewTool {
	var SCROLL_TYPE_HORIZONTAL;
	var SCROLL_TYPE_VERTICAL;
	var SCROLL_TYPE_BOTH;
	function buildScrollView();
}
declare module LogTool {
	function showLog();
}
declare module SpriteFrameManager {
	var spriteUseNodeObj;
	function getAllUINodeUseSprite();
	function clearSprite();
	function clearDestroyNode();
	function setSpriteFrame();
	function setSpriteFrameInAtlas();
	function init();
	function loadSpriteAtlas();
	function loadSpriteFrame();
}
declare module JsonDataTool {
	function init();
	function getDataByKey();
	function getTableByName();
	function getDataById();
}
declare module EventManager {
	function on();
	function off();
	function send();
}
declare module MemoryManager {
	function getNowSpriteUseMemory();
	function memoryCheck();
	function clearMemory();
}
declare module GameGlobalManager {
	var maxPersonId;
	var TIMER_TIME;
	function getNewPersonId();
	function init();
	function start();
	function stop();
	function pause();
}
declare module GameTool {
	function judgeEqualPos();
	function buildPos();
	function getNearBuildingCity();
	function getCityDis();
}
declare module BattleManager {
	function startBattle();
	function timeUpdate();
}
declare module GameData {
	function setData();
	function getData();
	function removeData();
}
declare module BaseUI {
	var __props__;
	var _sealed;
	var _requireComponent;
	var _executionOrder;
	function EventHandler();
}
declare module Game {
	function init();
}
declare module GameFactory {
	function createOneGame();
}
declare module UserRoleFactory {
	function getRandomUserRoleData();
	function createUserRole();
}





declare class UserRoleClass {
	_name: any;
	_attack: any;
	_def: any;
	_command: any;
	_intelligence: any;
	_charm: any;
	_politics: any;
	_maxHp: any;
	_sex: any;
	_moveSpeed: any;
	_presonSkillId: any;
	_battleSkillId: any;
	_equipAttack: any;
	_equipDef: any;
	_equipJewelry: any;
	_equipHorse: any;
	_nowHp: any;
	_id: any;
	_pos: any;
	_homePos: any;
	_goalCityMapPos: any;
	_nowMapPos: any;
	_goalCityId: any;
	_nowAction: any;
	_itemArr: any;
	_money: any;
	_power: any;
	_maxItemId: any;
	_inInBattle: any;
	_updateFuncArr: Function[];
	getSaveData(): void;
}
declare class BasePersonClass {
	_name: any;
	_attack: any;
	_def: any;
	_command: any;
	_intelligence: any;
	_charm: any;
	_politics: any;
	_maxHp: any;
	_sex: any;
	_moveSpeed: any;
	_presonSkillId: any;
	_battleSkillId: any;
	_equipAttack: any;
	_equipDef: any;
	_equipJewelry: any;
	_equipHorse: any;
	_nowHp: any;
	_id: any;
	_pos: any;
	_homePos: any;
	_goalCityMapPos: any;
	_nowMapPos: any;
	_goalCityId: any;
	_nowAction: any;
	_itemArr: any;
	_money: any;
	_power: any;
	_maxItemId: any;
	_inInBattle: any;
	goToCity(): void;
	goToBuilding(): void;
	actionFinishCb(): void;
	getItem(): void;
	timeUpdate(): void;
	dayUpdate(): void;
	getNewItemId(): void;
	removeItemByItemId(): void;
	sellGood(): void;
	getSaveData(): void;
	deadCb(): void;
	startBattleCb(): void;
	battleFinishCb(): void;
	treat(): void;
	mapRandomEventCb(): void;
	useHome(): void;
}
declare class BuildingClass {
	_id: any;
	_personArr: any;
	_name: any;
	_useType: any;
	useBuilding(): void;
}
declare class CityClass {
	_id: any;
	_peopleNum: any;
	_soldierNum: any;
	_horseNum: any;
	_commissariatNum: any;
	_moneyNum: any;
	_cityDefNum: any;
	_name: any;
	_cityPos: any;
	getBuildingById(): void;
	createOneRandomPerson(): void;
	dayUpdate(): void;
	getSaveData(): void;
	_personArr: any;
	_buildingArr: any;
}
declare class ForceClass {
	_id: any;
	_name: any;
	getSaveData(): void;
	_cityArr: any;
}
declare class GameClass {
	_allCityArr: any;
	_allPersonArr: any;
	_nowTimeYear: any;
	_nowTimeMonth: any;
	_nowTimeDay: any;
	_nowTimeHour: any;
	_nowTimeMinute: any;
	timeUpdate(): void;
	personDataBuild(): void;
	getPersonById(): void;
	getForceById(): void;
	getCityById(): void;
	getSaveJsonData(): void;
	getSaveData(): void;
	setGameData(): void;
	_allForceArr: any;
	_allPersonData: any;
}
declare class ActionClass {
	_id: any;
	_actionCostTime: any;
	_pos: any;
	_rewardArr: any;
	_name: any;
	_costPower: any;
	_costMoney: any;
	_nowUseTime: any;
	doAction(): void;
	timeUpdate(): void;
	getSaveData(): void;
}
declare class SellGoodClass {
	_itemId: any;
	_name: any;
	_price: any;
	_overdueTime: any;
	_overdueGood: any;
	_functionArr: any;
	_functionNumArr: any;
	_id: any;
	_getTime: any;
	dayUpdate(): void;
	use(): void;
	sell(): void;
	getSaveData(): void;
	judgeHaveFunctionByName(): void;
}
declare class BattleClass {
	_person_1: any;
	_person_2: any;
	timeUpdate(): void;
}

declare function _g_require();