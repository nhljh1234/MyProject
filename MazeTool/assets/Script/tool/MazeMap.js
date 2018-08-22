var outModule = {};

/**
 * 新建一个迷宫地图
 * @param {Number} width 宽度
 * @param {Number} height 高度
 */
outModule.getMazeMap = function (width, height, entryNum) {
    this.map = [];
    this.width = width;
    this.height = height;
    this.entryNum = entryNum;
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
            this.map.push({
                index: index,
                left: true,
                top: true,
                right: true,
                bottom: true,
                visitFlag: false,
                //是否在寻路路径上
                inPath: false
            });
        }
    }
    //寻路清除visitFlag
    this.clear = function () {
        this.map.forEach(function (oneData) {
            oneData.visitFlag = false;
        });
        this.visitNum = 0;
    }
    //判断是否全部访问了
    this.judgeAllVisit = function () {
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
        return 1500 / max;
    }
    //获取入口
    this.getEntryArr = function () {
        let leftArr = [], topArr = [], rightArr = [], bottomArr = [];
        let leftNum, topNum, rightNum, bottomNum;
        leftNum = topNum = rightNum = bottomNum = parseInt(this.entryNum / 4);
        let num = this.entryNum % 4;
        if (num >= 1) {
            leftNum++;
        }
        if (num >= 2) {
            topNum++;
        }
        if (num >= 3) {
            rightNum++;
        }
        //计算左边
        {
            let oneWidth = this.height / leftNum;
            let i;
            for (i = 0; i < leftNum; i++) {
                leftArr.push([0, parseInt(oneWidth / 2 + oneWidth * i)]);
            }
        }
        //上边
        {
            let oneWidth = this.width / topNum;
            let i;
            for (i = 0; i < topNum; i++) {
                topArr.push([parseInt(oneWidth / 2 + oneWidth * i), 0]);
            }
        }
        //计算右边
        {
            let oneWidth = this.height / rightNum;
            let i;
            for (i = 0; i < rightNum; i++) {
                rightArr.push([this.width - 1, parseInt(oneWidth / 2 + oneWidth * i)]);
            }
        }
        //下边
        {
            let oneWidth = this.width / bottomNum;
            let i;
            for (i = 0; i < bottomNum; i++) {
                bottomArr.push([parseInt(oneWidth / 2 + oneWidth * i), this.height - 1]);
            }
        }
        return leftArr.concat(topArr).concat(rightArr).concat(bottomArr);
    }
};

module.exports = outModule;