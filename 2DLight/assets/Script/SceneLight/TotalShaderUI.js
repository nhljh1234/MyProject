var SceneLightManager = require('SceneLightManager');
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {
        //最暗的亮度
        minLightNum: 0.1,
    },

    // use this for initialization
    onLoad: function () {
        SceneLightManager.setTotalNode(Shader.getShaderByName("TotalShader"), this.node, this.minLightNum);
    },

    // called every frame
    update: function () {

    },
});
