var SceneLightManager = require('SceneLightManager');
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {
        //最暗的亮度
        minLightNum: 0.1,
        //地面颜色系数
        minColorNum: 1,
        //是否启动遮挡检测
        useShadowJudge: 0,
    },

    // use this for initialization
    onLoad: function () {
        if (this.useShadowJudge) {
            SceneLightManager.setBgNode(Shader.getShaderByName("GroundShadowShader"), this.node, this.minLightNum, this.minColorNum);
        } else {
            SceneLightManager.setBgNode(Shader.getShaderByName("GroundShader"), this.node, this.minLightNum, this.minColorNum);
        }
    },

    // called every frame
    update: function () {

    },
});
