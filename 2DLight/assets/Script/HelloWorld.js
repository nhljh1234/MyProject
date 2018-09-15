var SceneLightManager = require('SceneLightManager');
cc.Class({
    extends: cc.Component,

    properties: {
        
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
            lightDataArr[0].node.position = new cc.Vec2(lightDataArr[0].pos.x , lightDataArr[0].pos.y);
            SceneLightManager.drawLight();
        }.bind(this));
        this.node.getChildByName('button_add').on('click', function () {
            window.global.z++;
            SceneLightManager.drawLight();
        });
        this.node.getChildByName('button_reduce').on('click', function () {
            window.global.z--;
            if (window.global.z < 10) {
                window.global.z = 10;
            }
            SceneLightManager.drawLight();
        });
    },

    // called every frame
    update: function (dt) {
        
    },
});
