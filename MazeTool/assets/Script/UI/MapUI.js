var MazeMap = require('MazeMap');
var logTool = require('logTool');
var DepthBuildTool = require('DepthBuildTool');
var PrimBuildTool = require('PrimBuildTool');
var DepthFindPathTool = require('DepthFindPathTool');
require('GlobalData');

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
        //生成地图
        var buttonBuildNode = this.node.getChildByName('buttonBuild');
        buttonBuildNode.on('click', function () {
            //判断toggle选中的状态
            let toggleContainerNode = this.node.getChildByName('toggleContainer');
            toggleContainerNode.children.forEach(function (childNode) {
                if (childNode.getComponent(cc.Toggle).isChecked) {
                    let width, height, hardNum;
                    [width, height, hardNum] = this.getData();
                    if (!this.judgeSize(width, height)) {
                        return;
                    }
                    switch (childNode.name) {
                        case 'toggle1':
                            this._mazeMap = new MazeMap.getMazeMap(width, height, hardNum, true);
                            this.buildMapUI();
                            this._mazeMap.getDataByPos(0, 0).left = false;
                            this.updateItemCallBack(0, 0);
                            new DepthBuildTool.createDepthBuildTool({ x: 0, y: 0 }, { x: width / 2 - 1, y: height / 2 - 1 },
                                { x: 0, y: 0 }, { x: width / 2 - 1, y: height / 2 - 1 },
                                this._mazeMap, this.updateItemCallBack.bind(this), function () {
                                    logTool.saveLog('生成完成');
                                }.bind(this)).startBuild();

                            this._mazeMap.getDataByPos(width - 1, 0).right = false;
                            this.updateItemCallBack(width - 1, 0);
                            new DepthBuildTool.createDepthBuildTool({ x: width - 1, y: 0 }, { x: width / 2, y: height / 2 - 1 },
                                { x: width / 2, y: 0 }, { x: width - 1, y: height / 2 - 1 },
                                this._mazeMap, this.updateItemCallBack.bind(this), function () {
                                    logTool.saveLog('生成完成');
                                }.bind(this)).startBuild();

                            this._mazeMap.getDataByPos(width - 1, height - 1).left = false;
                            this.updateItemCallBack(width - 1, height - 1);
                            new DepthBuildTool.createDepthBuildTool({ x: width - 1, y: height - 1 }, { x: width / 2, y: height / 2 },
                                { x: width / 2, y: height / 2 }, { x: width - 1, y: height - 1 },
                                this._mazeMap, this.updateItemCallBack.bind(this), function () {
                                    logTool.saveLog('生成完成');
                                }.bind(this)).startBuild();

                            this._mazeMap.getDataByPos(0, height - 1).left = false;
                            this.updateItemCallBack(0, height - 1);
                            new DepthBuildTool.createDepthBuildTool({ x: 0, y: height - 1 }, { x: width / 2 - 1, y: height / 2 },
                                { x: 0, y: height / 2 }, { x: width / 2 - 1, y: height - 1 },
                                this._mazeMap, this.updateItemCallBack.bind(this), function () {
                                    logTool.saveLog('生成完成');
                                }.bind(this)).startBuild();
                            break;
                        case 'toggle2':
                            this._mazeMap = new MazeMap.getMazeMap(width, height, hardNum, true);
                            this.buildMapUI();
                            this._mazeMap.getDataByPos(0, 0).left = false;
                            this.updateItemCallBack(0, 0);
                            new PrimBuildTool.createPrimBuildTool({ x: 0, y: 0 }, { x: width / 2 - 1, y: height / 2 - 1 },
                                { x: 0, y: 0 }, { x: width / 2 - 1, y: height / 2 - 1 },
                                this._mazeMap, this.updateItemCallBack.bind(this), function () {
                                    logTool.saveLog('生成完成');
                                }.bind(this)).startBuild();

                            this._mazeMap.getDataByPos(width - 1, 0).right = false;
                            this.updateItemCallBack(width - 1, 0);
                            new PrimBuildTool.createPrimBuildTool({ x: width - 1, y: 0 }, { x: width / 2, y: height / 2 - 1 },
                                { x: width / 2, y: 0 }, { x: width - 1, y: height / 2 - 1 },
                                this._mazeMap, this.updateItemCallBack.bind(this), function () {
                                    logTool.saveLog('生成完成');
                                }.bind(this)).startBuild();

                            this._mazeMap.getDataByPos(width - 1, height - 1).left = false;
                            this.updateItemCallBack(width - 1, height - 1);
                            new PrimBuildTool.createPrimBuildTool({ x: width - 1, y: height - 1 }, { x: width / 2, y: height / 2 },
                                { x: width / 2, y: height / 2 }, { x: width - 1, y: height - 1 },
                                this._mazeMap, this.updateItemCallBack.bind(this), function () {
                                    logTool.saveLog('生成完成');
                                }.bind(this)).startBuild();

                            this._mazeMap.getDataByPos(0, height - 1).left = false;
                            this.updateItemCallBack(0, height - 1);
                            new PrimBuildTool.createPrimBuildTool({ x: 0, y: height - 1 }, { x: width / 2 - 1, y: height / 2 },
                                { x: 0, y: height / 2 }, { x: width / 2 - 1, y: height - 1 },
                                this._mazeMap, this.updateItemCallBack.bind(this), function () {
                                    logTool.saveLog('生成完成');
                                }.bind(this)).startBuild();
                            break;
                        case 'toggle3':
                            this._mazeMap = new MazeMap.getMazeMap(width, height, hardNum, false);
                            this.buildMapUI();
                            this._mazeMap.getDataByPos(0, 0).left = false;
                            this.updateItemCallBack(0, 0);
                            //出口
                            this._mazeMap.getDataByPos(width / 2, height - 1).bottom = false;
                            this.updateItemCallBack(width / 2, height - 1);
                            this._mazeMap.getDataByPos(width - 1, height / 2).right = false;
                            this.updateItemCallBack(width - 1, height / 2);
                            new DepthBuildTool.createDepthBuildTool({ x: width - 1, y: height - 1 }, { x: 0, y: 0 },
                                { x: 0, y: 0 }, { x: width - 1, y: height - 1 },
                                this._mazeMap, this.updateItemCallBack.bind(this), function () {
                                    logTool.saveLog('生成完成');
                                }.bind(this)).startBuild();
                            break;
                        case 'toggle4':
                            this._mazeMap = new MazeMap.getMazeMap(width, height, hardNum, false);
                            this.buildMapUI();
                            this._mazeMap.getDataByPos(0, 0).left = false;
                            this.updateItemCallBack(0, 0);
                            //出口
                            this._mazeMap.getDataByPos(width - 1, 0).right = false;
                            this.updateItemCallBack(width - 1, 0);
                            this._mazeMap.getDataByPos(0, height - 1).left = false;
                            this.updateItemCallBack(0, height - 1);
                            new PrimBuildTool.createPrimBuildTool({ x: width - 1, y: height - 1 }, { x: 0, y: 0 },
                                { x: 0, y: 0 }, { x: width - 1, y: height - 1 },
                                this._mazeMap, this.updateItemCallBack.bind(this), function () {
                                    logTool.saveLog('生成完成');
                                }.bind(this)).startBuild();
                            break;
                    }
                }
            }.bind(this));
        }.bind(this));
        //寻路显示
        var buttonPathNode = this.node.getChildByName('buttonPath');
        buttonPathNode.on('click', function () {
            if (!this._mazeMap) {
                logTool.saveLog('还没有生成');
                return;
            }
            this.clearPath();
            let toggleContainerNode = this.node.getChildByName('toggleContainer');
            toggleContainerNode.children.forEach(function (childNode) {
                if (childNode.getComponent(cc.Toggle).isChecked) {
                    let width, height, hardNum;
                    [width, height, hardNum] = this.getData();
                    if (!this.judgeSize(width, height)) {
                        return;
                    }
                    switch (childNode.name) {
                        case 'toggle1':
                        case 'toggle2':
                            new DepthFindPathTool.createFindPathTool({ x: 0, y: 0 }, { x: width / 2 - 1, y: height / 2 - 1 },
                                { x: 0, y: 0 }, { x: width / 2 - 1, y: height / 2 - 1 },
                                this._mazeMap, this.updateItemCallBack.bind(this), function () {
                                    logTool.saveLog('寻路完成');
                                }.bind(this), GlobalData.LEFT_TOP).startFindPath();

                            new DepthFindPathTool.createFindPathTool({ x: width - 1, y: 0 }, { x: width / 2, y: height / 2 - 1 },
                                { x: width / 2, y: 0 }, { x: width - 1, y: height / 2 - 1 },
                                this._mazeMap, this.updateItemCallBack.bind(this), function () {
                                    logTool.saveLog('寻路完成');
                                }.bind(this), GlobalData.RIGHT_TOP).startFindPath();

                            new DepthFindPathTool.createFindPathTool({ x: width - 1, y: height - 1 }, { x: width / 2, y: height / 2 },
                                { x: width / 2, y: height / 2 }, { x: width - 1, y: height - 1 },
                                this._mazeMap, this.updateItemCallBack.bind(this), function () {
                                    logTool.saveLog('寻路完成');
                                }.bind(this), GlobalData.RIGHT_BOTTOM).startFindPath();

                            new DepthFindPathTool.createFindPathTool({ x: 0, y: height - 1 }, { x: width / 2 - 1, y: height / 2 },
                                { x: 0, y: height / 2 }, { x: width / 2 - 1, y: height - 1 },
                                this._mazeMap, this.updateItemCallBack.bind(this), function () {
                                    logTool.saveLog('寻路完成');
                                }.bind(this), GlobalData.LEFT_BOTTOM).startFindPath();
                            break;
                        case 'toggle3':
                            new DepthFindPathTool.createFindPathTool({ x: 0, y: 0 }, { x: width / 2, y: height - 1 },
                                { x: 0, y: 0 }, { x: width - 1, y: height - 1 },
                                this._mazeMap, this.updateItemCallBack.bind(this), function () {
                                    logTool.saveLog('寻路完成');
                                }.bind(this), GlobalData.LEFT_TOP).startFindPath();

                            new DepthFindPathTool.createFindPathTool({ x: 0, y: 0 }, { x: width - 1, y: height / 2 },
                                { x: 0, y: 0 }, { x: width - 1, y: height - 1 },
                                this._mazeMap, this.updateItemCallBack.bind(this), function () {
                                    logTool.saveLog('寻路完成');
                                }.bind(this), GlobalData.RIGHT_TOP).startFindPath();
                            break;
                        case 'toggle4':
                            new DepthFindPathTool.createFindPathTool({ x: 0, y: 0 }, { x: width - 1, y: 0 },
                                { x: 0, y: 0 }, { x: width - 1, y: height - 1 },
                                this._mazeMap, this.updateItemCallBack.bind(this), function () {
                                    logTool.saveLog('寻路完成');
                                }.bind(this), GlobalData.LEFT_TOP).startFindPath();

                            new DepthFindPathTool.createFindPathTool({ x: 0, y: 0 }, { x: 0, y: height - 1 },
                                { x: 0, y: 0 }, { x: width - 1, y: height - 1 },
                                this._mazeMap, this.updateItemCallBack.bind(this), function () {
                                    logTool.saveLog('寻路完成');
                                }.bind(this), GlobalData.RIGHT_TOP).startFindPath();
                            break;
                    }
                }
            }.bind(this));
        }.bind(this));
        //清除
        var buttonClearNode = this.node.getChildByName('buttonClear');
        buttonClearNode.on('click', function () {
            this.clearPath();
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

    //清除已有的寻路路径
    clearPath: function () {
        let mapNode = this.node.getChildByName('Map');
        mapNode.children.forEach((childNode) => {
            childNode.getChildByName('path_left').active = false;
            childNode.getChildByName('path_top').active = false;
            childNode.getChildByName('path_right').active = false;
            childNode.getChildByName('path_bottom').active = false;
        });
    },

    //更新按钮的回调
    updateItemCallBack: function (x, y, i) {
        let index = x * this._mazeMap.width + y;
        let mapNode = this.node.getChildByName('Map');
        let itemNode = mapNode.getChildByName('item_' + index);
        this.updateItemNode(itemNode, this._mazeMap.getDataByPos(x, y), i);
    },

    //判断尺寸
    judgeSize: function (width, height) {
        if (isNaN(width) || isNaN(height)) {
            logTool.saveLog('存在不合法数值！');
            return false;
        }
        if (width > 70 || height > 70) {
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
    updateItemNode: function (itemNode, data, quadrant) {
        itemNode.getChildByName('wall_left').active = data.left;
        itemNode.getChildByName('wall_top').active = data.top;
        itemNode.getChildByName('wall_right').active = data.right;
        itemNode.getChildByName('wall_bottom').active = data.bottom;
        itemNode.getChildByName('path_left').active = data.use_left;
        itemNode.getChildByName('path_top').active = data.use_top;
        itemNode.getChildByName('path_right').active = data.use_right;
        itemNode.getChildByName('path_bottom').active = data.use_bottom;
        switch (quadrant) {
            case GlobalData.LEFT_TOP:
                itemNode.getChildByName('path_left').color = cc.Color.RED;
                itemNode.getChildByName('path_top').color = cc.Color.RED;
                itemNode.getChildByName('path_right').color = cc.Color.RED;
                itemNode.getChildByName('path_bottom').color = cc.Color.RED;
                break;
            case GlobalData.RIGHT_TOP:
                itemNode.getChildByName('path_left').color = cc.Color.GREEN;
                itemNode.getChildByName('path_top').color = cc.Color.GREEN;
                itemNode.getChildByName('path_right').color = cc.Color.GREEN;
                itemNode.getChildByName('path_bottom').color = cc.Color.GREEN;
                break;
            case GlobalData.RIGHT_BOTTOM:
                itemNode.getChildByName('path_left').color = cc.Color.BLUE;
                itemNode.getChildByName('path_top').color = cc.Color.BLUE;
                itemNode.getChildByName('path_right').color = cc.Color.BLUE;
                itemNode.getChildByName('path_bottom').color = cc.Color.BLUE;
                break;
            case GlobalData.LEFT_BOTTOM:
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
            logTool.saveLog('尺寸没有指定');
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
