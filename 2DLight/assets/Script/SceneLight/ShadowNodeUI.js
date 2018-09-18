var SceneLightManager = require('SceneLightManager');
cc.Class({
    extends: cc.Component,

    properties: {
        worldNode: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        let data = {};
        data.scaleX = this.node.scaleX;
        data.height = this.node.height;
        SceneLightManager.addShadow(this.node, data, this.worldNode);
    },

    // called every frame
    update: function (dt) {

    },
});
