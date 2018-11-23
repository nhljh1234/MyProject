import { Building } from "./BuildingFactory";
import { Person } from "../PersonFactory";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../CityFactory";

//计算公式
function getSellPrice(cityData: City, itemData: any, building: BuildingShop, itemId: number): number {
    let costNum = itemData.costNum * cityData.peopleNum;
    let nowShopStorageNum = building.itemObj[itemId];
    return Math.min(itemData.price, (costNum / nowShopStorageNum) * itemData.price);
}

export class BuildingShop extends Building {
    //商店的库存
    itemObj: { [key: number]: number };
    constructor(buildingId: number, saveData: any, city: City) {
        super(buildingId, saveData, city);
        //初始化自身数据
        this.itemObj = {};
    }

    //每天更新函数
    //假装出售
    dayUpdate() {
        super.dayUpdate();
        for (var key in this.itemObj) {
            if (!this.itemObj.hasOwnProperty(key) || !this.itemObj[key]) {
                continue;
            }
            let itemData = MyGame.JsonDataTool.getDataById('_table_item_sellGood', key);
            let costNum = itemData.costNum * this.city.peopleNum;
            this.itemObj[key] = this.itemObj[key] - costNum;
            this.itemObj[key] = this.itemObj[key] < 0 ? 0 : this.itemObj[key];
        }
    }

    //使用商店
    useBuilding(personData: Person, isUser: boolean) {
        super.useBuilding(personData, isUser);
        let lastMoney = personData.money;
        if (!isUser) {
            //不是玩家使用的
            //全部卖完
            for (var key in personData.itemObj) {
                if (!personData.itemObj.hasOwnProperty(key) || !personData.itemObj[key]) {
                    continue;
                }
                let itemData = MyGame.JsonDataTool.getDataById('_table_item_sellGood', key);
                let sellPrice = getSellPrice(this.city, itemData, this, parseInt(key));
                //增加金钱
                personData.money = personData.money + sellPrice * personData.itemObj[key];
                this.itemObj[key] = this.itemObj[key] + personData.itemObj[key];
                personData.removeItemByItemId(parseInt(key), personData.itemObj[key]);
            }
        }
        MyGame.LogTool.showLog(`${personData.name} 卖东西`);
        MyGame.LogTool.showLog(`${personData.name} 获得了 ${personData.money - lastMoney}金钱`);
    }
}