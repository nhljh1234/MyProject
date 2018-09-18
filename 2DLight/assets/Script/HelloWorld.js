var SceneLightManager = require('SceneLightManager');
cc.Class({
    extends: cc.Component,

    properties: {
        _testNum: 1,
        _dir: 1,
        _start: false,
    },

    // use this for initialization
    onLoad: function () {
        window.global = {};
        window.global.z = 10;
        this.node.getChildByName('BGClick').on(cc.Node.EventType.TOUCH_START, function (event) {
            var newVec2 = event.target.convertTouchToNodeSpace(event.touch);
            let lightDataArr = SceneLightManager.getLightDataArr();
            lightDataArr[0].pos.x = newVec2.x - this.node.width / 2;
            lightDataArr[0].pos.y = newVec2.y - this.node.height / 2;
            lightDataArr[0].node.position = new cc.Vec2(lightDataArr[0].pos.x, lightDataArr[0].pos.y);
            this._start = true;
            SceneLightManager.drawLight();
        }.bind(this));
        this.node.getChildByName('button_add').on('click', function () {
            window.global.z++;
            //SceneLightManager.drawLight();
        });
        this.node.getChildByName('button_reduce').on('click', function () {
            window.global.z--;
            if (window.global.z < 10) {
                window.global.z = 10;
            }
            //SceneLightManager.drawLight();
        });

        this._testNum = 1;
        this._dir = 1;
        this._start = false;
    },

    // called every frame
    update: function (dt) {
        if (!this._start) {
            return;
        }
        var lightDataArr = SceneLightManager.getLightDataArr();
        var lightData = lightDataArr[0];

    
        this._testNum = this._testNum - 0.01 * this._dir;
        if (this._testNum < 1) {
            this._dir = -1;
        } else if (this._testNum > 1.5) {
            this._dir = 1;
        }

        window.global = {z : 1 * this._testNum + 10};
        lightData.diffNum = lightData.diffNumSave * this._testNum;
        SceneLightManager.changeGroundMinColorNum(SceneLightManager.GroundMinColorNum * this._testNum);
        //lightData.lightWidth = lightData.lightWidthSave * this._testNum;
        SceneLightManager.drawLight();
    },
});
