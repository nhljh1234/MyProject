var MazeMap = require('MazeMap');
var logTool = require('logTool');
var buildToolDepth = require('buildToolDepth');

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
        var buttonNode = this.node.getChildByName('button');
        buttonNode.on('click', function () {
            var widthNode = this.node.getChildByName('box_width');
            var heightNode = this.node.getChildByName('box_height');
            var entryNumNode = this.node.getChildByName('box_num');
            let width, height, entryNum;
            width = widthNode.getComponent(cc.EditBox).string;
            height = heightNode.getComponent(cc.EditBox).string;
            entryNum = entryNumNode.getComponent(cc.EditBox).string;
            width = parseInt(width);
            height = parseInt(height);
            entryNum = parseInt(entryNum);
            if (isNaN(width) || isNaN(height) || isNaN(entryNum)) {
                logTool.saveLog('存在不合法数值！');
                return;
            }
            if (width > 85 || height > 85) {
                logTool.saveLog('长度或宽度不能超过85！');
                return;
            }
            this._mazeMap = new MazeMap.getMazeMap(width, height, entryNum);
            this.buildMapUI();
            buildToolDepth.build(this._mazeMap, function (x, y) {
                let index = x * this._mazeMap.width + y;
                let mapNode = this.node.getChildByName('Map');
                let itemNode = mapNode.getChildByName('item_' + index);
                this.updateItemNode(itemNode, this._mazeMap.getDataByPos(x, y));
            }.bind(this), function () {
                logTool.saveLog('生成完成');
            }.bind(this));
        }.bind(this));
        var buttonPathNode = this.node.getChildByName('buttonPath');
        //一个出口一个出口显示
        this._findPathIndex = 0;
        buttonPathNode.on('click', function () {
            if (!this._mazeMap) {
                logTool.saveLog('还没有生成');
                return;
            }
            this._findPathIndex++;
            if (this._findPathIndex >= this._mazeMap.entryNum) {
                this._findPathIndex = 0; 
            }
            buildToolDepth.buildPath(this._mazeMap, this._findPathIndex, function (x, y) {
                let index = x * this._mazeMap.width + y;
                let mapNode = this.node.getChildByName('Map');
                let itemNode = mapNode.getChildByName('item_' + index);
                this.updateItemNode(itemNode, this._mazeMap.getDataByPos(x, y));
            }.bind(this), function () {
                logTool.saveLog('寻路完成');
            }.bind(this));
        }.bind(this));
        //初始化log
        logTool.init(function (logString) {
            this.node.getChildByName('log').getComponent(cc.Label).string = logString;
        }.bind(this));
    },

    //更新一个单元
    updateItemNode: function (itemNode, data) {
        itemNode.getChildByName('wall_left').active = data.left;
        itemNode.getChildByName('wall_top').active = data.top;
        itemNode.getChildByName('wall_right').active = data.right;
        itemNode.getChildByName('wall_bottom').active = data.bottom;
        itemNode.getChildByName('point').active = data.inPath;
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
                if (i === this._mazeMap.goalX && j === this._mazeMap.goalY) {
                    itemNodeClone.color = cc.Color.RED;
                }
            }
        }
    },
});
