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
};

module.exports = outModule;