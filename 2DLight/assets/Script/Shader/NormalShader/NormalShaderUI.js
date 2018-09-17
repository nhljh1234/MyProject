var SceneLightManager = require('SceneLightManager');
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {
        //超出光照范围时显示的比例
        minLightNum: 0.5,
        shadowNodeUp: {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        this.minLightNum = 0;
        SceneLightManager.setLightNodeShader(Shader.getShaderByName("NormalShader"), this.node, this.minLightNum);
        this.node.active = false;

        let data = {};
        data.scaleX = this.shadowNodeUp.scaleX;
        data.height = this.shadowNodeUp.height;
        SceneLightManager.addShadow(this.shadowNodeUp, data);
    },

    onDestroy: function () {

    },
});
