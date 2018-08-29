var outModule = {};
var local = {};

//获取随机的探索方向
local.getRandomNum = (i) => {
    //先判断要不要为难用户
    if (cc.random0To1() < (local.mazeMap.hardNum / 10)) {
        //为难
        switch (i) {
            case 0:
                return cc.random0To1() > 0.5 ? 0 : 1;
            case 1:
                return cc.random0To1() > 0.5 ? 2 : 1;
            case 2:
                return cc.random0To1() > 0.5 ? 2 : 3;
            case 3:
                return cc.random0To1() > 0.5 ? 0 : 3;
        }
    } else {
        return parseInt(cc.random0To1() * 4);
    }
};

//判断是否可以走
local.judgeGo = function (x, y, i) {
    if (i === 0) {
        //0, 0
        if (x < 0 || y < 0 || x >= (local.mazeMap.width / 2) || y >= (local.mazeMap.height / 2)) {
            return false;
        }
    }
    if (i === 1) {
        //width - 1, 0
        if (x < local.mazeMap.width / 2 || y < 0 || x >= local.mazeMap.width || y >= (local.mazeMap.height / 2)) {
            return false;
        }
    }
    if (i === 2) {
        //width - 1, height - 1
        if (x < local.mazeMap.width / 2 || y < local.mazeMap.height / 2 || x >= local.mazeMap.width || y >= local.mazeMap.height) {
            return false;
        }
    }
    if (i === 3) {
        //0, height - 1
        if (x < 0 || y < local.mazeMap.height / 2 || x >= (local.mazeMap.width / 2) || y >= local.mazeMap.height) {
            return false;
        }
    }
    return !local.mazeMap.getDataByPos(x, y).visitFlag;
};

//深度搜索
local.depthFunc = function (x, y, i) {
    if (local.mazeMap.judgeAllVisit()) {
        //表示结束
        return false;
    }
    local.mazeMap.visitOnePos(x, y);
    //判断有没有可以走的相邻节点
    if (!local.judgeGo(x - 1, y, i) && !local.judgeGo(x + 1, y, i) &&
        !local.judgeGo(x, y - 1, i) && !local.judgeGo(x, y + 1, i)) {
        return true;
    }
    //随机上下左右
    let randomNum = local.getRandomNum(i);
    let visitArr = [0, 0, 0, 0];
    while (true) {
        switch (randomNum) {
            case 0:
                //左边
                visitArr[randomNum] = 1;
                if (local.judgeGo(x - 1, y, i)) {
                    local.mazeMap.getDataByPos(x, y).left = false;
                    local.mazeMap.getDataByPos(x - 1, y).right = false;
                    if (local.cb) {
                        local.cb(x, y);
                        local.cb(x - 1, y);
                    }
                    if (!local.depthFunc(x - 1, y, i)) {
                        return false;
                    }
                }
                break;
            case 1:
                //上边
                visitArr[randomNum] = 1;
                if (local.judgeGo(x, y - 1, i)) {
                    local.mazeMap.getDataByPos(x, y).top = false;
                    local.mazeMap.getDataByPos(x, y - 1).bottom = false;
                    if (local.cb) {
                        local.cb(x, y);
                        local.cb(x, y - 1);
                    }
                    if (!local.depthFunc(x, y - 1, i)) {
                        return false;
                    }
                }
                break;
            case 2:
                //右边
                visitArr[randomNum] = 1;
                if (local.judgeGo(x + 1, y, i)) {
                    local.mazeMap.getDataByPos(x, y).right = false;
                    local.mazeMap.getDataByPos(x + 1, y).left = false;
                    if (local.cb) {
                        local.cb(x, y);
                        local.cb(x + 1, y);
                    }
                    if (!local.depthFunc(x + 1, y, i)) {
                        return false;
                    }
                }
                break;
            case 3:
                //下边
                visitArr[randomNum] = 1;
                if (local.judgeGo(x, y + 1, i)) {
                    local.mazeMap.getDataByPos(x, y).bottom = false;
                    local.mazeMap.getDataByPos(x, y + 1).top = false;
                    if (local.cb) {
                        local.cb(x, y);
                        local.cb(x, y + 1);
                    }
                    if (!local.depthFunc(x, y + 1, i)) {
                        return false;
                    }
                }
                break;
        }
        randomNum++;
        if (randomNum > 3) {
            randomNum = 0;
        }
        let flag = visitArr.some(function (num) {
            return num === 0;
        });
        if (!flag) {
            break;
        }
    }
    return true;
};

outModule.build = function (mazeMap, cb, finishCb) {
    //数据初始化
    local.cb = cb;
    local.finishCb = finishCb;
    local.mazeMap = mazeMap;
    //开始创建
    let i, len, entryArr = local.mazeMap.getEntryArr();
    for (i = 0, len = entryArr.length; i < len; i++) {
        let pos = entryArr[i];
        if (pos[0] === 0) {
            local.mazeMap.getDataByPos(pos[0], pos[1]).left = false;
        } else if (pos[1] === 0) {
            local.mazeMap.getDataByPos(pos[0], pos[1]).top = false;
        } else if (pos[0] === local.mazeMap.width - 1) {
            local.mazeMap.getDataByPos(pos[0], pos[1]).right = false;
        } else if (pos[1] === local.mazeMap.height - 1) {
            local.mazeMap.getDataByPos(pos[0], pos[1]).bottom = false;
        }
        local.cb(pos[0], pos[1]);
        local.depthFunc(pos[0], pos[1], i);
        local.mazeMap.clear();
    }
    if (local.mazeMap.judgeAllVisit()) {
        if (local.finishCb) {
            local.finishCb();
        }
    }
};

//寻路
local.findPath = function (x, y, i) {
    if (local.mazeMap.judgeGetGoal(x, y)) {
        local.mazeMap.getDataByPos(x, y).inPath = true;
        local.cb(x, y, i);
        return true;
    }
    if (local.mazeMap.judgeAllVisit()) {
        //表示结束
        return false;
    }
    local.mazeMap.visitOnePos(x, y);
    //判断有没有可以走的相邻节点
    if (!local.judgeGo(x - 1, y, i) && !local.judgeGo(x + 1, y, i) &&
        !local.judgeGo(x, y - 1, i) && !local.judgeGo(x, y + 1, i)) {
        return false;
    }
    //已经寻路了
    if (local.mazeMap.getDataByPos(x, y).inPath) {
        //local.mazeMap.getDataByPos(x, y).inPath = true;
        //local.cb(x, y);
        //return true;
    }
    {
        //左边
        if (!local.mazeMap.getDataByPos(x, y).left && local.judgeGo(x - 1, y, i)) {
            if (local.findPath(x - 1, y, i)) {
                local.mazeMap.getDataByPos(x, y).inPath = true;
                local.mazeMap.getDataByPos(x, y).use_left = true;
                local.mazeMap.getDataByPos(x - 1, y).use_right = true;
                local.cb(x, y, i);
                local.cb(x - 1, y, i);
                return true;
            }
        }
    }
    {
        //上边
        if (!local.mazeMap.getDataByPos(x, y).top && local.judgeGo(x, y - 1, i)) {
            if (local.findPath(x, y - 1, i)) {
                local.mazeMap.getDataByPos(x, y).inPath = true;
                local.mazeMap.getDataByPos(x, y).use_top = true;
                local.mazeMap.getDataByPos(x, y - 1).use_bottom = true;
                local.cb(x, y, i);
                local.cb(x, y - 1, i);
                return true;
            }
        }
    }
    {
        //右边
        if (!local.mazeMap.getDataByPos(x, y).right && local.judgeGo(x + 1, y, i)) {
            if (local.findPath(x + 1, y, i)) {
                local.mazeMap.getDataByPos(x, y).inPath = true;
                local.mazeMap.getDataByPos(x, y).use_right = true;
                local.mazeMap.getDataByPos(x + 1, y).use_left = true;
                local.cb(x, y, i);
                local.cb(x + 1, y, i);
                return true;
            }
        }
    }
    {
        //下边
        if (!local.mazeMap.getDataByPos(x, y).bottom && local.judgeGo(x, y + 1, i)) {
            if (local.findPath(x, y + 1, i)) {
                local.mazeMap.getDataByPos(x, y).inPath = true;
                local.mazeMap.getDataByPos(x, y).use_bottom = true;
                local.mazeMap.getDataByPos(x, y + 1).use_top = true;
                local.cb(x, y, i);
                local.cb(x, y + 1, i);
                return true;
            }
        }
    }
    return false;
};

//绘制路径
//绘制第几个出口
outModule.buildPath = function (mazeMap, cb, finishCb) {
    //数据初始化
    local.cb = cb;
    local.finishCb = finishCb;
    local.mazeMap = mazeMap;
    //开始创建
    let i, len, entryArr = local.mazeMap.getEntryArr();
    for (i = 0, len = entryArr.length; i < len; i++) {
        let pos = entryArr[i];
        local.findPath(pos[0], pos[1], i);
        local.mazeMap.clear();
    }
}

local.getWallData = function (x_1, y_1, x_2, y_2) {
    return {
        pos_1: {x: x_1, y: y_1},
        pos_2: {x: x_2, y: y_2}
    }
};

local.visitPrim = function (x, y, i) {
    local.mazeMap.getDataByPos(x, y).visitFlag = true;
    //加入arr
    if (local.judgeGo(x - 1, y, i)) {
        local.wallArr.push(local.getWallData(x, y, x - 1, y));
    }
    if (local.judgeGo(x + 1, y, i)) {
        local.wallArr.push(local.getWallData(x, y, x + 1, y));
    }
    if (local.judgeGo(x, y + 1, i)) {
        local.wallArr.push(local.getWallData(x, y, x, y + 1));
    }
    if (local.judgeGo(x, y - 1, i)) {
        local.wallArr.push(local.getWallData(x, y, x, y - 1));
    }
};

local.buildByPrim = function (i) {
    while (true) {
        let length = local.wallArr.length;
        if (length === 0) {
            break;
        }
        let randomNum = parseInt(cc.random0To1() * length);
        let wallData = local.wallArr[randomNum];
        if (local.mazeMap.getDataByPos(wallData.pos_2.x, wallData.pos_2.y).visitFlag) {
            //移除
            local.wallArr.splice(randomNum, 1);
        } else {
            //移除
            local.wallArr.splice(randomNum, 1);
            //加入
            local.visitPrim(wallData.pos_2.x, wallData.pos_2.y, i);
            if (wallData.pos_1.x === wallData.pos_2.x) {
                if (wallData.pos_2.y > wallData.pos_1.y) {
                    local.mazeMap.getDataByPos(wallData.pos_1.x, wallData.pos_1.y).bottom = false;
                    local.mazeMap.getDataByPos(wallData.pos_2.x, wallData.pos_2.y).top = false;
                } else if (wallData.pos_2.y < wallData.pos_1.y) {
                    local.mazeMap.getDataByPos(wallData.pos_1.x, wallData.pos_1.y).top = false;
                    local.mazeMap.getDataByPos(wallData.pos_2.x, wallData.pos_2.y).bottom = false;
                }
            } else if (wallData.pos_1.y === wallData.pos_2.y){
                if (wallData.pos_2.x > wallData.pos_1.x) {
                    local.mazeMap.getDataByPos(wallData.pos_1.x, wallData.pos_1.y).right = false;
                    local.mazeMap.getDataByPos(wallData.pos_2.x, wallData.pos_2.y).left = false;
                } else if (wallData.pos_2.x < wallData.pos_1.x) {
                    local.mazeMap.getDataByPos(wallData.pos_1.x, wallData.pos_1.y).left = false;
                    local.mazeMap.getDataByPos(wallData.pos_2.x, wallData.pos_2.y).right = false;
                }
            }
            local.cb(wallData.pos_1.x, wallData.pos_1.y);
            local.cb(wallData.pos_2.x, wallData.pos_2.y);
        }
    }
};

//用Prim生成
outModule.buildByPrim = function (mazeMap, cb, finishCb) {
    //数据初始化
    local.cb = cb;
    local.finishCb = finishCb;
    local.mazeMap = mazeMap;
    //开始创建
    let i, len, entryArr = local.mazeMap.getEntryArrRandom();
    for (i = 0, len = entryArr.length; i < len; i++) {
        let pos = entryArr[i];
        if (pos[0] === 0) {
            local.mazeMap.getDataByPos(pos[0], pos[1]).left = false;
        } else if (pos[1] === 0) {
            local.mazeMap.getDataByPos(pos[0], pos[1]).top = false;
        } else if (pos[0] === local.mazeMap.width - 1) {
            local.mazeMap.getDataByPos(pos[0], pos[1]).right = false;
        } else if (pos[1] === local.mazeMap.height - 1) {
            local.mazeMap.getDataByPos(pos[0], pos[1]).bottom = false;
        }
        local.cb(pos[0], pos[1]);
        local.wallArr = [];
        local.visitPrim(pos[0], pos[1], i);
        local.buildByPrim(i);
        local.mazeMap.clear();
    }
    if (local.mazeMap.judgeAllVisit()) {
        if (local.finishCb) {
            local.finishCb();
        }
    }
};

module.exports = outModule;