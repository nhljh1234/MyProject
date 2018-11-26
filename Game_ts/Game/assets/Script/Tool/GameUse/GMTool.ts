import { MyGame } from "../System/Game";

export function changeUserRolePower (nowPower: number) {
    let userRole = MyGame.GameManager.userRole;
    if (userRole) {
        userRole.changePower(nowPower);
    }
}

export function changeUserPosCity (nowCityId: number) {
    let userRole = MyGame.GameManager.userRole;
    if (userRole) {
        userRole.personPos.cityId = nowCityId;
    }
    MyGame.EventManager.send(MyGame.EventName.USER_ROLE_STATUS_CHANGE);
}