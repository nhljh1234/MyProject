var outModule = {};

/**
 * 新建一个迷宫地图
 * @param {Number} width 宽度
 * @param {Number} height 高度
 * @param {Number} hardNum 难度
 * @param {Boolean} isCenterType 是否是中心点事终点
 */
outModule.getMazeMap = function (width, height, hardNum, isCenterType) {
    this.map = [];
    this.width = width;
    this.height = height;
    if (isNaN(hardNum) || hardNum > 10 || hardNum < 0) {
        hardNum = 7;
    }
    this.hardNum = hardNum;
    this.visitNum = 0;
    this.goalX = Math.ceil(this.width / 2) - 1;
    this.goalY = Math.ceil(this.height / 2) - 1;
    //初始化地图
    //左上角是(0,0)
    let i, j;
    for (i = 0; i < width; i++) {
        for (j = 0; j < height; j++) {
            let index = i * width + j;
            //0表示没访问过
            //四个方位表示四面墙
            //中心点周围的四个点特殊处理
            let left = true;
            let top = true;
            let right = true;
            let bottom = true;
            if (isCenterType) {
                if (i === this.width / 2 && j === this.height / 2) {
                    left = false;
                    top = false;
                } else if (i === this.width / 2 - 1 && j === this.height / 2) {
                    right = false;
                    top = false;
                } else if (i === this.width / 2 - 1 && j === this.height / 2 - 1) {
                    right = false;
                    bottom = false;
                } else if (i === this.width / 2 && j === this.height / 2 - 1) {
                    left = false;
                    bottom = false;
                }
            }
            this.map.push({
                index: index,
                left: left,
                top: top,
                right: right,
                bottom: bottom,
                visitFlag: false,
                //是否在寻路路径上
                inPath: false,
                //寻路
                use_left: false,
                use_top: false,
                use_right: false,
                use_bottom: false,
            });
        }
    }
    //判断是不是寻路到了
    this.judgeGetGoal = function (x, y) {
        if (x === this.width / 2 && y === this.height / 2) {
            return true;
        } else if (x === this.width / 2 - 1 && y === this.height / 2) {
            return true;
        } else if (x === this.width / 2 - 1 && y === this.height / 2 - 1) {
            return true;
        } else if (x === this.width / 2 && y === this.height / 2 - 1) {
            return true;
        }
        return false;
    }
    this.judgeGetGoal_2 = function (x, y, i) {
        let outPos_1 = [this.width - 1, 0];
        let outPos_2 = [0, this.height - 1];
        if (x === outPos_1[0] && y === outPos_1[1] && i === 0) {
            return true;
        } else if (x === outPos_2[0] && y === outPos_2[1] && i === 1) {
            return true;
        }
        return false;
    }
    //寻路清除visitFlag
    this.clear = function () {
        this.map.forEach(function (oneData) {
            oneData.visitFlag = false;
            oneData.use_left = false;
            oneData.use_top = false;
            oneData.use_right = false;
            oneData.use_bottom = false;
            oneData.inPath = false;
        });
        this.visitNum = 0;
    }
    //判断是否全部访问了
    this.judgeAllVisit = function () {
        return this.visitNum >= this.width * this.height / 4;
    }
    //判断是否全部访问了
    this.judgeAllVisit_2 = function () {
        return this.visitNum >= this.width * this.height;
    }
    //访问一个节点
    this.visitOnePos = function (x, y) {
        if (this.getDataByPos(x, y).visitFlag) {
            return;
        }
        this.getDataByPos(x, y).visitFlag = true;
        this.visitNum++;
    }
    //获取制定pos的地图单元数据
    this.getDataByPos = function (x, y) {
        return this.map[x * this.width + y];
    }
    //获取单位宽度
    this.getOneWidth = function () {
        let max = Math.max(this.width, this.height);
        return 3000 / max;
    }
    //获取随机入口
    this.getEntryArrRandom = function () {
        let count = 0;
        let arr = [];
        //第一个
        if (cc.random0To1() > 0.5) {
            //以中心点为入口
            arr.push([this.width / 2 - 1, this.height / 2 - 1]);
            count++;
        } else {
            arr.push([0, 0]);
        }
        //第二个
        if (cc.random0To1() > 0.5) {
            //以中心点为入口
            arr.push([this.width / 2, this.height / 2 - 1]);
            count++;
        } else {
            arr.push([this.width - 1, 0]);
        }
        //第三个
        if (cc.random0To1() > 0.5 && count < 2) {
            //以中心点为入口
            arr.push([this.width / 2, this.height / 2]);
            count++;
        } else {
            if (count === 0) {
                arr.push([this.width / 2, this.height / 2]);
                count++;
            } else {
                arr.push([this.width - 1, this.height - 1]);
            }
        }
        //第四个
        if (cc.random0To1() > 0.5 && count < 2) {
            //以中心点为入口
            arr.push([this.width / 2, this.height / 2]);
            count++;
        } else {
            if (count === 1) {
                arr.push([this.width / 2 - 1, this.height / 2]);
                count++;
            } else {
                arr.push([0, this.height - 1]);
            }
        }
        return arr;
    }
    //获取入口
    this.getEntryArr = function () {
        return [
            [0, 0],
            [this.width - 1, 0],
            [this.width - 1, this.height - 1],
            [0, this.height - 1],
        ];
        // let leftArr = [], topArr = [], rightArr = [], bottomArr = [];
        // let leftNum, topNum, rightNum, bottomNum;
        // leftNum = topNum = rightNum = bottomNum = parseInt(this.entryNum / 4);
        // let num = this.entryNum % 4;
        // if (num >= 1) {
        //     leftNum++;
        // }
        // if (num >= 2) {
        //     topNum++;
        // }
        // if (num >= 3) {
        //     rightNum++;
        // }
        // //计算左边
        // {
        //     let oneWidth = this.height / leftNum;
        //     let i;
        //     for (i = 0; i < leftNum; i++) {
        //         leftArr.push([0, parseInt(oneWidth / 2 + oneWidth * i)]);
        //     }
        // }
        // //上边
        // {
        //     let oneWidth = this.width / topNum;
        //     let i;
        //     for (i = 0; i < topNum; i++) {
        //         topArr.push([parseInt(oneWidth / 2 + oneWidth * i), 0]);
        //     }
        // }
        // //计算右边
        // {
        //     let oneWidth = this.height / rightNum;
        //     let i;
        //     for (i = 0; i < rightNum; i++) {
        //         rightArr.push([this.width - 1, parseInt(oneWidth / 2 + oneWidth * i)]);
        //     }
        // }
        // //下边
        // {
        //     let oneWidth = this.width / bottomNum;
        //     let i;
        //     for (i = 0; i < bottomNum; i++) {
        //         bottomArr.push([parseInt(oneWidth / 2 + oneWidth * i), this.height - 1]);
        //     }
        // }
        // return leftArr.concat(topArr).concat(rightArr).concat(bottomArr);
    }
};

module.exports = outModule;