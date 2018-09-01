var outModule = {};
var local = {};

outModule.createPrimBuildTool = function (posStart, posEnd, posLeftTop, posRightDown, mazeMap, updateCb, finishCb) {
    this.posStart = posStart;
    this.posEnd = posEnd;
    this.posLeftTop = posLeftTop;
    this.posRightDown = posRightDown;
    this.mazeMap = mazeMap;
    this.updateCb = updateCb;
    this.finishCb = finishCb;

    this.wallArr = [];

    this.width = this.posRightDown.x - this.posLeftTop.x + 1;
    this.height = this.posRightDown.y - this.posLeftTop.y + 1;

    this.getWallData = function (x_1, y_1, x_2, y_2) {
        return {
            pos_1: { x: x_1, y: y_1 },
            pos_2: { x: x_2, y: y_2 }
        }
    };

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

    this.visitPrim = function (x, y) {
        this.mazeMap.getDataByPos(x, y).visitFlag = true;
        //加入arr
        if (this.judgeGo(x - 1, y)) {
            this.wallArr.push(this.getWallData(x, y, x - 1, y));
        }
        if (this.judgeGo(x + 1, y)) {
            this.wallArr.push(this.getWallData(x, y, x + 1, y));
        }
        if (this.judgeGo(x, y + 1)) {
            this.wallArr.push(this.getWallData(x, y, x, y + 1));
        }
        if (this.judgeGo(x, y - 1)) {
            this.wallArr.push(this.getWallData(x, y, x, y - 1));
        }
    };

    //深度函数循环
    this.buildByPrim = function () {
        while (true) {
            let length = this.wallArr.length;
            if (length === 0) {
                break;
            }
            let randomNum = parseInt(cc.random0To1() * length);
            let wallData = this.wallArr[randomNum];
            if (this.mazeMap.getDataByPos(wallData.pos_2.x, wallData.pos_2.y).visitFlag) {
                //移除
                this.wallArr.splice(randomNum, 1);
            } else {
                //移除
                this.wallArr.splice(randomNum, 1);
                //加入
                this.visitPrim(wallData.pos_2.x, wallData.pos_2.y);
                if (wallData.pos_1.x === wallData.pos_2.x) {
                    if (wallData.pos_2.y > wallData.pos_1.y) {
                        this.mazeMap.getDataByPos(wallData.pos_1.x, wallData.pos_1.y).bottom = false;
                        this.mazeMap.getDataByPos(wallData.pos_2.x, wallData.pos_2.y).top = false;
                    } else if (wallData.pos_2.y < wallData.pos_1.y) {
                        this.mazeMap.getDataByPos(wallData.pos_1.x, wallData.pos_1.y).top = false;
                        this.mazeMap.getDataByPos(wallData.pos_2.x, wallData.pos_2.y).bottom = false;
                    }
                } else if (wallData.pos_1.y === wallData.pos_2.y) {
                    if (wallData.pos_2.x > wallData.pos_1.x) {
                        this.mazeMap.getDataByPos(wallData.pos_1.x, wallData.pos_1.y).right = false;
                        this.mazeMap.getDataByPos(wallData.pos_2.x, wallData.pos_2.y).left = false;
                    } else if (wallData.pos_2.x < wallData.pos_1.x) {
                        this.mazeMap.getDataByPos(wallData.pos_1.x, wallData.pos_1.y).left = false;
                        this.mazeMap.getDataByPos(wallData.pos_2.x, wallData.pos_2.y).right = false;
                    }
                }
                this.updateCb(wallData.pos_1.x, wallData.pos_1.y);
                this.updateCb(wallData.pos_2.x, wallData.pos_2.y);
            }
        }
    };

    //开始生成
    this.startBuild = function () {
        this.mazeMap.clear();
        this.updateCb(posStart.x, posStart.y);
        this.wallArr = [];
        this.mazeMap.clear();
        this.visitPrim(posStart.x, posStart.y);
        this.buildByPrim();
        if (this.judgeAllVisit()) {
            if (this.finishCb) {
                this.finishCb();
            }
        }
    };
};

module.exports = outModule;