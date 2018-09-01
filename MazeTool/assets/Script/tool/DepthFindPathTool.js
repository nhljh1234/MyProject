var outModule = {};
var local = {};

//新建一个寻路工具
//用的是深度搜索
/**
 * @param {*} posStart 起点
 * @param {*} posEnd 终点
 * @param {*} posLeftTop 左上角
 * @param {*} posRightDown 右下角
 * @param {*} mazeMap 
 * @param {*} updateCb 
 * @param {*} finishCb 
 * @param {*} quadrant 象限
 * posLeftTop和posRightDown用于框定尺寸
 */
outModule.createFindPathTool = function (posStart, posEnd, posLeftTop, posRightDown, mazeMap, updateCb, finishCb, quadrant) {
    this.posStart = posStart;
    this.posEnd = posEnd;
    this.posLeftTop = posLeftTop;
    this.posRightDown = posRightDown;
    this.mazeMap = mazeMap;
    this.updateCb = updateCb;
    this.finishCb = finishCb;
    this.quadrant = quadrant;

    this.width = this.posRightDown.x - this.posLeftTop.x + 1;
    this.height = this.posRightDown.y - this.posLeftTop.y + 1;

    //判断是否可以继续行走
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
    },

    //判断是否访问了所有的单元格
    this.judgeAllVisit = function () {
        return this.mazeMap.visitNum >= this.width * this.height;
    },

    this.judgeGetGoal = function (x, y) {
        if (x === posEnd.x && y === posEnd.y) {
            return true;
        }
        return false;
    },

    this.findPath = function (x, y) {
        if (this.judgeGetGoal(x, y)) {
            this.updateCb(x, y, this.quadrant);
            return true;
        }
        if (this.judgeAllVisit()) {
            //表示结束
            return false;
        }
        this.mazeMap.visitOnePos(x, y);
        //判断有没有可以走的相邻节点
        if (!this.judgeGo(x - 1, y) && !this.judgeGo(x + 1, y) &&
            !this.judgeGo(x, y - 1) && !this.judgeGo(x, y + 1)) {
            return false;
        }
        {
            //左边
            if (!this.mazeMap.getDataByPos(x, y).left && this.judgeGo(x - 1, y)) {
                if (this.findPath(x - 1, y)) {
                    this.mazeMap.getDataByPos(x, y).use_left = true;
                    this.mazeMap.getDataByPos(x - 1, y).use_right = true;
                    this.updateCb(x, y, this.quadrant);
                    this.updateCb(x - 1, y, this.quadrant);
                    return true;
                }
            }
        }
        {
            //上边
            if (!this.mazeMap.getDataByPos(x, y).top && this.judgeGo(x, y - 1)) {
                if (this.findPath(x, y - 1)) {
                    this.mazeMap.getDataByPos(x, y).inPath = true;
                    this.mazeMap.getDataByPos(x, y).use_top = true;
                    this.mazeMap.getDataByPos(x, y - 1).use_bottom = true;
                    this.updateCb(x, y, this.quadrant);
                    this.updateCb(x, y - 1, this.quadrant);
                    return true;
                }
            }
        }
        {
            //右边
            if (!this.mazeMap.getDataByPos(x, y).right && this.judgeGo(x + 1, y)) {
                if (this.findPath(x + 1, y)) {
                    this.mazeMap.getDataByPos(x, y).inPath = true;
                    this.mazeMap.getDataByPos(x, y).use_right = true;
                    this.mazeMap.getDataByPos(x + 1, y).use_left = true;
                    this.updateCb(x, y, this.quadrant);
                    this.updateCb(x + 1, y, this.quadrant);
                    return true;
                }
            }
        }
        {
            //下边
            if (!this.mazeMap.getDataByPos(x, y).bottom && this.judgeGo(x, y + 1)) {
                if (this.findPath(x, y + 1)) {
                    this.mazeMap.getDataByPos(x, y).inPath = true;
                    this.mazeMap.getDataByPos(x, y).use_bottom = true;
                    this.mazeMap.getDataByPos(x, y + 1).use_top = true;
                    this.updateCb(x, y, this.quadrant);
                    this.updateCb(x, y + 1, this.quadrant);
                    return true;
                }
            }
        }
        return false;
    };

    //开始寻路
    this.startFindPath = function () {
        this.mazeMap.clear();
        if (this.findPath(posStart.x, posStart.y, this.quadrant)) {
            if (this.finishCb) {
                this.finishCb();
            }
        }
    };
};

module.exports = outModule;