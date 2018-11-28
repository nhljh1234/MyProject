import { Force } from "./ForceFactory";
import { City } from "./CityFactory";
import { Person } from "./PersonFactory";
import { MyGame } from "../Tool/System/Game";

/**
 * 全局游戏数据工厂
 */

export class Game {
    //所有势力
    allForceArr: Force[];
    //所有的城市
    allCityArr: City[];
    //所有的人
    allPersonArr: Person[];
    allPersonData: { [key: number]: Person } = {};
    //当前年份
    nowTimeYear: number;
    //当前月份
    nowTimeMonth: number;
    //当前日
    nowTimeDay: number;
    //当前小时
    nowTimeHour: number;
    //当前分钟
    nowTimeMinute: number;


    constructor(saveData: any, month: number, day: number) {
        if (saveData) {
            this.initGameBySaveData(saveData);
        } else {
            this.initGame(month, day);
        }
    }

    private initGameBySaveData(saveData: any) {
        //这边这个按照一个虚拟的年号来做
        this.nowTimeYear = saveData.year;
        //这边设置可以选择出生年月日
        this.nowTimeMonth = saveData.month;
        this.nowTimeDay = saveData.day;
        this.nowTimeHour = saveData.hour;
        this.nowTimeMinute = saveData.minute;

        MyGame.GameManager.maxPersonId = saveData.maxPersonId;
    }

    private initGame(month: number, day: number) {
        this.allForceArr = MyGame.JsonDataTool.getTableByName('_table_force_force').array.map(function (oneForce) {
            return new Force(oneForce.main_id, undefined);
        });
        this.allCityArr = [];
        this.allPersonArr = [];
        this.nowTimeYear = 1;
        this.nowTimeMonth = month || 6;
        this.nowTimeDay = day || 1;
        this.nowTimeHour = 8;
        this.nowTimeMinute = 0;
        //初始化其他东西
        //根据割据势力初始化城市和npc
        this.allForceArr.forEach(function (oneForceData: Force) {
            oneForceData.cityArr.forEach(function (oneCityDay: City) {
                this.allCityArr.push(oneCityDay);
                this.allPersonArr = this.allPersonArr.concat(oneCityDay.personArr);
            }.bind(this));
        }.bind(this));
        this.personDataBuild();
    }

    //时间更新函数
    timeUpdate(addMinutes: number) {
        var newDate = MyGame.TimeTool.getNewDate(this.nowTimeYear, this.nowTimeMonth, this.nowTimeDay, this.nowTimeHour, this.nowTimeMinute, addMinutes);
        var isDayChange = false;
        //这边先判断是否有时间段的变化
        if (this.nowTimeHour !== newDate.hour) {
            MyGame.EventManager.send(MyGame.EventName.TIME_UPDATE_HOUR);
        }
        if (this.nowTimeDay !== newDate.day) {
            MyGame.EventManager.send(MyGame.EventName.TIME_UPDATE_DAY);
            isDayChange = true;
        }
        if (this.nowTimeMonth !== newDate.month) {
            MyGame.EventManager.send(MyGame.EventName.TIME_UPDATE_MONTH);
        }
        if (MyGame.TimeTool.getSeason(this.nowTimeMonth) !== MyGame.TimeTool.getSeason(newDate.month)) {
            MyGame.EventManager.send(MyGame.EventName.TIME_UPDATE_SEASON);
        }
        if (this.nowTimeYear !== newDate.year) {
            MyGame.EventManager.send(MyGame.EventName.TIME_UPDATE_YEAR);
        }

        this.nowTimeYear = newDate.year;
        this.nowTimeMonth = newDate.month;
        this.nowTimeDay = newDate.day;
        this.nowTimeHour = newDate.hour;
        this.nowTimeMinute = newDate.minute;
        //cc.log(DateTool.getTimeStrWithEra(game.nowTimeYear, game.nowTimeMonth, game.nowTimeDay, game.nowTimeHour, game.nowTimeMinute));
        if (isDayChange) {
            //城市有每日更新的函数
            this.allCityArr.forEach(function (oneCityData) {
                oneCityData.dayUpdate();
            });
            //每个人也有有每日更新的函数
            this.allPersonArr.forEach(function (onePersonData) {
                //onePersonData.dayUpdate();
            });
            console.log('game save');
            MyGame.GameSaveTool.saveGame();
        }
        //人物更新函数
        this.allPersonArr.forEach(function (onePersonData) {
            //onePersonData.timeUpdate(addMinutes);
        });
        //战斗定时器
        MyGame.BattleManager.timeUpdate(addMinutes);
        //玩家更新函数
        MyGame.GameManager.userRole.timeUpdate(addMinutes);
        //更新人物栏目
        MyGame.EventManager.send(MyGame.EventName.USER_ROLE_STATUS_CHANGE);
    };
    //game里面存储的是所有人物的列表，转换成以id为key的对象数据
    personDataBuild() {
        if (!this.allPersonData) {
            this.allPersonData = {};
        }
        this.allPersonArr.forEach(function (onePersonData) {
            this.allPersonData[onePersonData.personId] = onePersonData;
        }.bind(this));
    };
    //根据id查找人物数据
    getPersonById(personId: number): Person {
        let i = 0, len = this.allPersonArr.length;
        for (i = 0; i < len; i++) {
            if (this.allPersonArr[i].personId === personId) {
                return this.allPersonArr[i];
            }
        }
    };
    //根据id查找势力数据
    getForceById(forceId: number): Force {
        let i = 0, len = this.allForceArr.length;
        for (i = 0; i < len; i++) {
            if (this.allForceArr[i].forceId === forceId) {
                return this.allForceArr[i];
            }
        }
    };
    //根据id查找城市数据
    getCityById(cityId: number): City {
        let i = 0, len = this.allCityArr.length;
        for (i = 0; i < len; i++) {
            if (this.allCityArr[i].cityId === cityId) {
                return this.allCityArr[i];
            }
        }
    };
    //获取游戏存储的数据
    getSaveJsonData() {
        return this.getSaveData();
    };
    //获取
    getSaveData () {
        return {
            year: this.nowTimeYear,
            month: this.nowTimeMonth,
            day: this.nowTimeDay,
            hour: this.nowTimeHour,
            minute: this.nowTimeMinute,
            maxPersonId: MyGame.GameManager.maxPersonId,
            forceArr: this.allForceArr.map(function (oneForceData) {
                return oneForceData.getSaveData();
            }),
            cityArr: this.allCityArr.map(function (oneCityData) {
                return oneCityData.getSaveData()
            }),
            personArr: this.allPersonArr.map(function (onePersonData) {
                return onePersonData.getSaveData();
            }),
        }
    };
    //设置数据
    setGameData (saveData) {
        //初始化的时候倒置，大的类可能会引用小的类
        //全部人物
        this.allPersonArr = saveData.personArr.map(function (data) {
            return new Person(undefined, data, undefined, undefined);
        });
        //全部城市
        this.allCityArr = saveData.cityArr.map(function (data) {
            return new City(undefined, data);
        });
        //全部割据势力
        this.allForceArr = saveData.forceArr.map(function (data) {
            return new Force(undefined, data);
        });
        //根据割据势力初始化城市和npc
        this.personDataBuild();
    };
}