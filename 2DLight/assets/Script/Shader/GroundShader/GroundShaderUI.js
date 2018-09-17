var SceneLightManager = require('SceneLightManager');
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {
        //最暗的亮度
        minLightNum: 0.1,
        //地面颜色系数
        minColorNum: 1,
    },

    // use this for initialization
    onLoad: function () {
        this.minLightNum = 0.2;
        SceneLightManager.setBgNode(Shader.getShaderByName("GroundShader"), this.node, this.minLightNum, this.minColorNum);
    },

    // called every frame
    update: function () {

    },
});
