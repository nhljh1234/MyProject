declare interface _table_Game_gameParameter {
	main_id: number;
	name: string;
	num: number;
}
declare interface _table_Game_userRandomData {
	main_id: number;
	name: string;
	num: number;
}
declare interface _table_action_action {
	main_id: number;
	costTime: number;
	name: string;
	pos: any;
	rewardArr: string;
	costPower: number;
	costMoney: number;
}
declare interface _table_building_building {
	main_id: number;
	name: string;
	useType: string;
	showFlag: number;
	function: number;
	functionNum: number;
}
declare interface _table_building_buildingFunction {
	main_id: number;
	name: string;
	type: string;
}
declare interface _table_city_city {
	main_id: number;
	name: string;
	building: string;
	npc: any;
	peopleNum: number;
	soldierNum: number;
	horseNum: number;
	commissariatNum: number;
	moneyNum: number;
	cityDef: number;
	cityPos: string;
	randomNpcNum: number;
}
declare interface _table_event_mapRandomEvent {
	main_id: number;
	name: string;
	randomNum: number;
	type: string;
	num: number;
}
declare interface _table_force_force {
	main_id: number;
	name: string;
	city: string;
}
declare interface _table_item_itemFunction {
	main_id: number;
	name: string;
	type: string;
}
declare interface _table_item_sellGood {
	main_id: number;
	name: string;
	price: number;
	costNum: number;
	function: number;
	functionNum: number;
}
declare interface _table_person_person {
	main_id: number;
	name: string;
	attack: number;
	def: number;
	command: number;
	intelligence: number;
	charm: number;
	politics: number;
	sex: number;
	moveSpeed: number;
}
declare interface _table_user_userParameter {
	main_id: number;
	name: string;
	num: number;
}