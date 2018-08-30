var MazeMap = require('MazeMap');
var logTool = require('logTool');
var buildTool = require('buildTool');
var buildTool_2 = require('buildTool_2');

cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: {
            type: cc.Prefab,
            default: null
        },
        //迷宫地图
        _mazeMap: null,
        _findPathIndex: 0,
    },

    onLoad() {
        //注册按钮
        //深度搜索算法
        var buttonNode = this.node.getChildByName('buttonBuild_1');
        buttonNode.on('click', function () {
            let width, height, hardNum;
            [width, height, hardNum] = this.getData();
            if (!this.judgeSize(width, height)) {
                return;
            }
            this._mazeMap = new MazeMap.getMazeMap(width, height, hardNum, true);
            this.buildMapUI();
            buildTool.build(this._mazeMap, function (x, y) {
                let index = x * this._mazeMap.width + y;
                let mapNode = this.node.getChildByName('Map');
                let itemNode = mapNode.getChildByName('item_' + index);
                this.updateItemNode(itemNode, this._mazeMap.getDataByPos(x, y));
            }.bind(this), function () {
                logTool.saveLog('生成完成');
            }.bind(this));
        }.bind(this));
        //Prim搜索算法
        var buttonNode = this.node.getChildByName('buttonBuild_2');
        buttonNode.on('click', function () {
            let width, height, hardNum;
            [width, height, hardNum] = this.getData();
            if (!this.judgeSize(width, height)) {
                return;
            }
            this._mazeMap = new MazeMap.getMazeMap(width, height, hardNum, true);
            this.buildMapUI();
            buildTool.buildByPrim(this._mazeMap, function (x, y) {
                let index = x * this._mazeMap.width + y;
                let mapNode = this.node.getChildByName('Map');
                let itemNode = mapNode.getChildByName('item_' + index);
                this.updateItemNode(itemNode, this._mazeMap.getDataByPos(x, y));
            }.bind(this), function () {
                logTool.saveLog('生成完成');
            }.bind(this));
        }.bind(this));
        //深度搜索算法2
        var buttonNode = this.node.getChildByName('buttonBuild_3');
        buttonNode.on('click', function () {
            let width, height, hardNum;
            [width, height, hardNum] = this.getData();
            if (!this.judgeSize(width, height)) {
                return;
            }
            this._mazeMap = new MazeMap.getMazeMap(width, height, hardNum, false);
            this.buildMapUI();
            buildTool_2.build(this._mazeMap, function (x, y) {
                let index = x * this._mazeMap.width + y;
                let mapNode = this.node.getChildByName('Map');
                let itemNode = mapNode.getChildByName('item_' + index);
                this.updateItemNode(itemNode, this._mazeMap.getDataByPos(x, y));
            }.bind(this), function () {
                logTool.saveLog('生成完成');
            }.bind(this));
        }.bind(this));
        //Prim搜索算法2
        var buttonNode = this.node.getChildByName('buttonBuild_4');
        buttonNode.on('click', function () {
            let width, height, hardNum;
            [width, height, hardNum] = this.getData();
            if (!this.judgeSize(width, height)) {
                return;
            }
            this._mazeMap = new MazeMap.getMazeMap(width, height, hardNum, false);
            this.buildMapUI();
            buildTool_2.buildByPrim(this._mazeMap, function (x, y) {
                let index = x * this._mazeMap.width + y;
                let mapNode = this.node.getChildByName('Map');
                let itemNode = mapNode.getChildByName('item_' + index);
                this.updateItemNode(itemNode, this._mazeMap.getDataByPos(x, y));
            }.bind(this), function () {
                logTool.saveLog('生成完成');
            }.bind(this));
        }.bind(this));
        //寻路显示
        var buttonPathNode = this.node.getChildByName('buttonPath_1');
        buttonPathNode.on('click', function () {
            if (!this._mazeMap) {
                logTool.saveLog('还没有生成');
                return;
            }
            let mapNode = this.node.getChildByName('Map');
            mapNode.children.forEach(function (childNode) {
                childNode.getChildByName('path_left').active = false;
                childNode.getChildByName('path_top').active = false;
                childNode.getChildByName('path_right').active = false;
                childNode.getChildByName('path_bottom').active = false;
            });
            buildTool.buildPath(this._mazeMap, function (x, y, i) {
                let index = x * this._mazeMap.width + y;
                let mapNode = this.node.getChildByName('Map');
                let itemNode = mapNode.getChildByName('item_' + index);
                this.updateItemNode(itemNode, this._mazeMap.getDataByPos(x, y), i);
            }.bind(this), function () {
                logTool.saveLog('寻路完成');
            }.bind(this));
        }.bind(this));
        //寻路显示
        var buttonPathNode = this.node.getChildByName('buttonPath_2');
        buttonPathNode.on('click', function () {
            if (!this._mazeMap) {
                logTool.saveLog('还没有生成');
                return;
            }
            let mapNode = this.node.getChildByName('Map');
            mapNode.children.forEach(function (childNode) {
                childNode.getChildByName('path_left').active = false;
                childNode.getChildByName('path_top').active = false;
                childNode.getChildByName('path_right').active = false;
                childNode.getChildByName('path_bottom').active = false;
            });
            buildTool_2.buildPath(this._mazeMap, function (x, y, i) {
                let index = x * this._mazeMap.width + y;
                let mapNode = this.node.getChildByName('Map');
                let itemNode = mapNode.getChildByName('item_' + index);
                this.updateItemNode(itemNode, this._mazeMap.getDataByPos(x, y), i);
            }.bind(this), function () {
                logTool.saveLog('寻路完成');
            }.bind(this));
        }.bind(this));
        //清除
        var buttonClearNode = this.node.getChildByName('buttonClear');
        buttonClearNode.on('click', function () {
            let mapNode = this.node.getChildByName('Map');
            mapNode.children.forEach((childNode) => {
                childNode.getChildByName('path_left').active = false;
                childNode.getChildByName('path_top').active = false;
                childNode.getChildByName('path_right').active = false;
                childNode.getChildByName('path_bottom').active = false;
            });
        }.bind(this));
        //截图
        var buttonImgNode = this.node.getChildByName('buttonImg');
        buttonImgNode.on('click', function () {
            this.node.children.forEach((childNode) => {
                if (childNode.name !== 'Map') {
                    childNode.active = false;
                }
            });
            function callback() {
                var canvas = document.getElementById("GameCanvas");
                var base64 = canvas.toDataURL("image/png");
                cc.director.off(cc.Director.EVENT_AFTER_DRAW);
                window.open(base64);
                this.node.children.forEach((childNode) => {
                    childNode.active = true;
                });
            };
            cc.director.on(cc.Director.EVENT_AFTER_DRAW, callback.bind(this));
        }.bind(this));
        //初始化log
        logTool.init(function (logString) {
            this.node.getChildByName('log').getComponent(cc.Label).string = logString;
        }.bind(this));
    },

    //判断尺寸
    judgeSize: function (width, height) {
        if (isNaN(width) || isNaN(height)) {
            logTool.saveLog('存在不合法数值！');
            return false;
        }
        if (width > 75 || height > 75) {
            logTool.saveLog('长度或宽度不能超过75！');
            return false;
        }
        if (width % 2 === 1 || height % 2 === 1) {
            logTool.saveLog('长度或宽度不能为奇数！');
            return false;
        }
        return true;
    },

    getData: function () {
        var widthNode = this.node.getChildByName('box_width');
        var heightNode = this.node.getChildByName('box_height');
        var hardNode = this.node.getChildByName('box_easy');
        let width, height, hardNum;
        width = widthNode.getComponent(cc.EditBox).string;
        height = heightNode.getComponent(cc.EditBox).string;
        hardNum = hardNode.getComponent(cc.EditBox).string;
        width = parseInt(width);
        height = parseInt(height);
        hardNum = parseInt(hardNum);
        return [width, height, hardNum];
    },

    //更新一个单元
    updateItemNode: function (itemNode, data, i) {
        itemNode.getChildByName('wall_left').active = data.left;
        itemNode.getChildByName('wall_top').active = data.top;
        itemNode.getChildByName('wall_right').active = data.right;
        itemNode.getChildByName('wall_bottom').active = data.bottom;
        itemNode.getChildByName('path_left').active = data.use_left;
        itemNode.getChildByName('path_top').active = data.use_top;
        itemNode.getChildByName('path_right').active = data.use_right;
        itemNode.getChildByName('path_bottom').active = data.use_bottom;
        switch (i) {
            case 0:
                itemNode.getChildByName('path_left').color = cc.Color.RED;
                itemNode.getChildByName('path_top').color = cc.Color.RED;
                itemNode.getChildByName('path_right').color = cc.Color.RED;
                itemNode.getChildByName('path_bottom').color = cc.Color.RED;
                break;
            case 1:
                itemNode.getChildByName('path_left').color = cc.Color.GREEN;
                itemNode.getChildByName('path_top').color = cc.Color.GREEN;
                itemNode.getChildByName('path_right').color = cc.Color.GREEN;
                itemNode.getChildByName('path_bottom').color = cc.Color.GREEN;
                break;
            case 2:
                itemNode.getChildByName('path_left').color = cc.Color.BLUE;
                itemNode.getChildByName('path_top').color = cc.Color.BLUE;
                itemNode.getChildByName('path_right').color = cc.Color.BLUE;
                itemNode.getChildByName('path_bottom').color = cc.Color.BLUE;
                break;
            case 3:
                itemNode.getChildByName('path_left').color = cc.Color.WHITE;
                itemNode.getChildByName('path_top').color = cc.Color.WHITE;
                itemNode.getChildByName('path_right').color = cc.Color.WHITE;
                itemNode.getChildByName('path_bottom').color = cc.Color.WHITE;
                break;
        }
    },

    /**
     * 创建地图
     */
    buildMapUI: function () {
        if (!this._mazeMap) {
            logTool.saveLog('尺寸没有制定');
            return;
        }
        let oneWidth = this._mazeMap.getOneWidth();
        let width = this._mazeMap.width;
        let height = this._mazeMap.height;
        let i, j;
        let mapNode = this.node.getChildByName('Map');
        mapNode.removeAllChildren(true);
        for (i = 0; i < width; i++) {
            for (j = 0; j < height; j++) {
                let itemNodeClone = cc.instantiate(this.itemPrefab);
                mapNode.addChild(itemNodeClone);
                itemNodeClone.scaleX = oneWidth / itemNodeClone.width;
                itemNodeClone.scaleY = oneWidth / itemNodeClone.height;
                itemNodeClone.x = i * oneWidth + 0.5 * oneWidth;
                itemNodeClone.y = -1 * (j * oneWidth + 0.5 * oneWidth);
                itemNodeClone.name = 'item_' + (i * width + j);
                this.updateItemNode(itemNodeClone, this._mazeMap.getDataByPos(i, j));
            }
        }
    },
});
