var outModule = {};
var local = {};

//获取随机的探索方向
local.getRandomNum = () => {
    return parseInt(cc.random0To1() * 4);
};

//判断是否可以走
local.judgeGo = function (x, y) {
    if (x < 0 || y < 0 || x >= local.mazeMap.width || y >= local.mazeMap.height) {
        return false;
    }
    return !local.mazeMap.getDataByPos(x, y).visitFlag;
};

//深度搜索
local.depthFunc = function (x, y) {
    if (local.mazeMap.judgeAllVisit()) {
        //表示结束
        return false;
    }
    local.mazeMap.visitOnePos(x, y);
    //判断有没有可以走的相邻节点
    if (!local.judgeGo(x - 1, y) && !local.judgeGo(x + 1, y) &&
        !local.judgeGo(x, y - 1) && !local.judgeGo(x, y + 1)) {
        return true;
    }
    //随机上下左右
    let randomNum = local.getRandomNum();
    let visitArr = [0, 0, 0, 0];
    while (true) {
        switch (randomNum) {
            case 0:
                //左边
                visitArr[randomNum] = 1;
                if (local.judgeGo(x - 1, y)) {
                    local.mazeMap.getDataByPos(x, y).left = false;
                    local.mazeMap.getDataByPos(x - 1, y).right = false;
                    if (local.cb) {
                        local.cb(x, y);
                        local.cb(x - 1, y);
                    }
                    if (!local.depthFunc(x - 1, y)) {
                        return false;
                    }
                }
                break;
            case 1:
                //上边
                visitArr[randomNum] = 1;
                if (local.judgeGo(x, y - 1)) {
                    local.mazeMap.getDataByPos(x, y).top = false;
                    local.mazeMap.getDataByPos(x, y - 1).bottom = false;
                    if (local.cb) {
                        local.cb(x, y);
                        local.cb(x, y - 1);
                    }
                    if (!local.depthFunc(x, y - 1)) {
                        return false;
                    }
                }
                break;
            case 2:
                //右边
                visitArr[randomNum] = 1;
                if (local.judgeGo(x + 1, y)) {
                    local.mazeMap.getDataByPos(x, y).right = false;
                    local.mazeMap.getDataByPos(x + 1, y).left = false;
                    if (local.cb) {
                        local.cb(x, y);
                        local.cb(x + 1, y);
                    }
                    if (!local.depthFunc(x + 1, y)) {
                        return false;
                    }
                }
                break;
            case 3:
                //下边
                visitArr[randomNum] = 1;
                if (local.judgeGo(x, y + 1)) {
                    local.mazeMap.getDataByPos(x, y).bottom = false;
                    local.mazeMap.getDataByPos(x, y + 1).top = false;
                    if (local.cb) {
                        local.cb(x, y);
                        local.cb(x, y + 1);
                    }
                    if (!local.depthFunc(x, y + 1)) {
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
        if (i === 0) {
            local.depthFunc(pos[0], pos[1]);
            if (local.mazeMap.judgeAllVisit()) {
                if (local.finishCb) {
                    local.finishCb();
                }
            }
        }
    }
};

//寻路
local.findPath = function (x, y) {
    if (local.mazeMap.judgeAllVisit()) {
        //表示结束
        return false;
    }
    local.mazeMap.visitOnePos(x, y);
    //判断有没有可以走的相邻节点
    if (!local.judgeGo(x - 1, y) && !local.judgeGo(x + 1, y) &&
        !local.judgeGo(x, y - 1) && !local.judgeGo(x, y + 1)) {
        return false;
    }
    if (x === local.mazeMap.goalX && y === local.mazeMap.goalY) {
        local.mazeMap.getDataByPos(x, y).inPath = true;
        local.cb(x, y);
        return true;
    }
    //已经寻路了
    if (local.mazeMap.getDataByPos(x, y).inPath) {
        //local.mazeMap.getDataByPos(x, y).inPath = true;
        //local.cb(x, y);
        //return true;
    }
    {
        //左边
        if (!local.mazeMap.getDataByPos(x, y).left && local.judgeGo(x - 1, y)) {
            if (local.findPath(x - 1, y)) {
                local.mazeMap.getDataByPos(x, y).inPath = true;
                local.cb(x, y);
                return true;
            }
        }
    }
    {
        //上边
        if (!local.mazeMap.getDataByPos(x, y).top && local.judgeGo(x, y - 1)) {
            if (local.findPath(x, y - 1)) {
                local.mazeMap.getDataByPos(x, y).inPath = true;
                local.cb(x, y);
                return true;
            }
        }
    }
    {
        //右边
        if (!local.mazeMap.getDataByPos(x, y).right && local.judgeGo(x + 1, y)) {
            if (local.findPath(x + 1, y)) {
                local.mazeMap.getDataByPos(x, y).inPath = true;
                local.cb(x, y);
                return true;
            }
        }
    }
    {
        //下边
        if (!local.mazeMap.getDataByPos(x, y).bottom && local.judgeGo(x, y + 1)) {
            if (local.findPath(x, y + 1)) {
                local.mazeMap.getDataByPos(x, y).inPath = true;
                local.cb(x, y);
                return true;
            }
        }
    }
    return false;
};

//绘制路径
//绘制第几个出口
outModule.buildPath = function (mazeMap, index, cb, finishCb) {
    //数据初始化
    local.cb = cb;
    local.finishCb = finishCb;
    local.mazeMap = mazeMap;
    //开始创建
    let i, len, entryArr = local.mazeMap.getEntryArr();
    for (i = 0, len = entryArr.length; i < len; i++) {
        if (i !== index) {
            continue;
        }
        let pos = entryArr[i];
        local.mazeMap.clear();
        local.findPath(pos[0], pos[1]);
    }
};

module.exports = outModule;