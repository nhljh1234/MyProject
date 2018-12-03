/**
 * 比较两个对象是否相同
 */
export function equal(obj_1, obj_2): boolean {
    if (typeof obj_1 !== typeof obj_2) {
        return false;
    }
    if (typeof obj_1 === 'object') {
        if (obj_1 === null) {
            return obj_1 === obj_2;
        }
        //如果是控件的话
        if (obj_1.uuid) {
            return obj_1.uuid === obj_2.uuid;
        }
        //判断key的数量
        if (Object.keys(obj_1).length !== Object.keys(obj_2).length) {
            return false;
        }
        for (var key in obj_1) {
            if (!obj_1.hasOwnProperty(key)) {
                continue;
            }
            let flag = equal(obj_1[key], obj_2[key]);
            if (!flag) {
                return flag;
            }
        }
    } else {
        return obj_1 === obj_2;
    }
    return true;
}


/**
 * 判断数值是否相同
 */
const EPSILON = 0.000001;
export function equalNum(a: number, b: number) {
    return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
};