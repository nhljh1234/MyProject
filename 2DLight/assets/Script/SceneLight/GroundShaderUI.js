var SceneLightManager = require('SceneLightManager');
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {
        //开始衰减的距离，1表示不衰减
        reduceNum: 0.5,
        //抗锯齿程度，值越小锯齿越少
        AntiAliasingNum: 0.001,
        //是否启动遮挡检测
        useShadowMath: 0,
        //法线贴图，只画法线贴图没有透明度的地方
        normalSpriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },
    },

    // use this for initialization
    onLoad: function () {
        SceneLightManager.setBgNode(Shader.getShaderByName("GroundShadowShader"), this.node, this.reduceNum, this.AntiAliasingNum, this.useShadowMath, this.normalSpriteFrame);
    },

    // called every frame
    update: function () {

    },
});
