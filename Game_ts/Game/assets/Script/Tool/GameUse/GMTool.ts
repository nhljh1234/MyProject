import { MyGame } from "../System/Game";

export function changeUserRolePower(nowPower: number) {
    let userRole = MyGame.GameManager.userRole;
    if (userRole) {
        userRole.changePower(nowPower);
    }
}

export function changeUserPosCity(nowCityId: number) {
    let userRole = MyGame.GameManager.userRole;
    if (userRole) {
        userRole.personPos.cityId = nowCityId;
    }
    MyGame.EventManager.send(MyGame.EventName.USER_ROLE_STATUS_CHANGE);
}

export function changeItemNum(itemId: number, addNum: number) {
    let userRole = MyGame.GameManager.userRole;
    if (userRole) {
        if (!userRole.itemObj[itemId]) {
            userRole.itemObj[itemId] = 0;
        }
        userRole.itemObj[itemId] = userRole.itemObj[itemId] + addNum;
    }
    MyGame.EventManager.send(MyGame.EventName.USER_ROLE_ITEM_CHANGE);
}