var SceneLightManager = require('SceneLightManager');
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {
        //抗锯齿程度，值越小锯齿越少
        AntiAliasingNum: 0.005,
        //穿透程度，这个值越大，遮挡像素点会被渲染得越多
        tiltNum: 2,
        //是否启动遮挡检测
        useShadowMath: 0,
        //法线贴图，只画法线贴图有透明度的地方
        normalSpriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },
    },

    // use this for initialization
    onLoad: function () {
        if (!this.normalSpriteFrame) {
            //法线贴图是必须的
            return;
        }
        SceneLightManager.addNormalNode(Shader.getShaderByName("NormalShader"), this.node, 
            this.AntiAliasingNum, this.tiltNum, this.useShadowMath, this.normalSpriteFrame);
    },

    onDestroy: function () {

    },
});
