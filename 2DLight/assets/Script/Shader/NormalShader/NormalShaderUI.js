var SceneLightManager = require('SceneLightManager');
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {
        //超出光照范围时显示的比例
        minLightNum: 0.5
    },

    // use this for initialization
    onLoad: function () {
        SceneLightManager.setLightNodeShader(Shader.getShaderByName("NormalShader"), this.node, this.minLightNum);
        this.node.active = false;
    },

    onDestroy: function () {

    },
});
