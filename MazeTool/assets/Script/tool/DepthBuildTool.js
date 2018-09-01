var outModule = {};
var local = {};

outModule.createDepthBuildTool = function (posStart, posEnd, posLeftTop, posRightDown, mazeMap, updateCb, finishCb) {
    this.posStart = posStart;
    this.posEnd = posEnd;
    this.posLeftTop = posLeftTop;
    this.posRightDown = posRightDown;
    this.mazeMap = mazeMap;
    this.updateCb = updateCb;
    this.finishCb = finishCb;

    this.width = this.posRightDown.x - this.posLeftTop.x + 1;
    this.height = this.posRightDown.y - this.posLeftTop.y + 1;

    //判断一个点是否可以前进
    this.judgeGo = function (x, y) {
        if (x < this.posLeftTop.x) {
            return false;
        }
        if (y < this.posLeftTop.y) {
            return false;
        }
        if (x > this.posRightDown.x) {
            return false;
        }
        if (y > this.posRightDown.y) {
            return false;
        }
        return !this.mazeMap.getDataByPos(x, y).visitFlag;
    };

    //判断是否访问了所有的单元格
    this.judgeAllVisit = function () {
        return this.mazeMap.visitNum >= this.width * this.height;
    };

    //获取随机的探索方向
    this.getRandomNum = function (quadrant) {
        //先判断要不要为难用户
        if (cc.random0To1() < (this.mazeMap.hardNum / 10)) {
            //为难
            switch (quadrant) {
                case GlobalData.LEFT_TOP:
                    return cc.random0To1() > 0.5 ? GlobalData.DIRECTION_LEFT : GlobalData.DIRECTION_TOP;
                case GlobalData.RIGHT_TOP:
                    return cc.random0To1() > 0.5 ? GlobalData.DIRECTION_RIGHT : GlobalData.DIRECTION_TOP;
                case GlobalData.RIGHT_BOTTOM:
                    return cc.random0To1() > 0.5 ? GlobalData.DIRECTION_RIGHT : GlobalData.DIRECTION_BOTTOM;
                case GlobalData.LEFT_BOTTOM:
                    return cc.random0To1() > 0.5 ? GlobalData.DIRECTION_LEFT : GlobalData.DIRECTION_BOTTOM;
                default:
                    return cc.random0To1() > 0.5 ? GlobalData.DIRECTION_LEFT : GlobalData.DIRECTION_TOP;
            }
        } else {
            return parseInt(cc.random0To1() * 4);
        }
    };

    //深度函数循环
    this.depthFunc = function (x, y) {
        if (this.judgeAllVisit()) {
            //表示结束
            return false;
        }
        this.mazeMap.visitOnePos(x, y);
        //判断有没有可以走的相邻节点
        if (!this.judgeGo(x - 1, y) && !this.judgeGo(x + 1, y) &&
            !this.judgeGo(x, y - 1) && !this.judgeGo(x, y + 1)) {
            return true;
        }
        //随机上下左右
        let randomNum = this.getRandomNum(this.quadrant);
        let visitArr = [0, 0, 0, 0];
        while (true) {
            switch (randomNum) {
                case 0:
                    //左边
                    visitArr[randomNum] = 1;
                    if (this.judgeGo(x - 1, y, i)) {
                        this.mazeMap.getDataByPos(x, y).left = false;
                        this.mazeMap.getDataByPos(x - 1, y).right = false;
                        this.updateCb(x, y);
                        this.updateCb(x - 1, y);
                        if (!this.depthFunc(x - 1, y, i)) {
                            return false;
                        }
                    }
                    break;
                case 1:
                    //上边
                    visitArr[randomNum] = 1;
                    if (this.judgeGo(x, y - 1, i)) {
                        this.mazeMap.getDataByPos(x, y).top = false;
                        this.mazeMap.getDataByPos(x, y - 1).bottom = false;
                        this.updateCb(x, y);
                        this.updateCb(x, y - 1);
                        if (!this.depthFunc(x, y - 1, i)) {
                            return false;
                        }
                    }
                    break;
                case 2:
                    //右边
                    visitArr[randomNum] = 1;
                    if (this.judgeGo(x + 1, y, i)) {
                        this.mazeMap.getDataByPos(x, y).right = false;
                        this.mazeMap.getDataByPos(x + 1, y).left = false;
                        this.updateCb(x, y);
                        this.updateCb(x + 1, y);
                        if (!this.depthFunc(x + 1, y, i)) {
                            return false;
                        }
                    }
                    break;
                case 3:
                    //下边
                    visitArr[randomNum] = 1;
                    if (this.judgeGo(x, y + 1, i)) {
                        this.mazeMap.getDataByPos(x, y).bottom = false;
                        this.mazeMap.getDataByPos(x, y + 1).top = false;
                        this.updateCb(x, y);
                        this.updateCb(x, y + 1);
                        if (!this.depthFunc(x, y + 1, i)) {
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

    //开始生成
    this.startBuild = function () {
        this.mazeMap.clear();
        this.updateCb(posStart.x, posStart.y);
        this.depthFunc(posStart.x, posStart.y);
        if (this.judgeAllVisit()) {
            if (this.finishCb) {
                this.finishCb();
            }
        }
    };
};

module.exports = outModule;