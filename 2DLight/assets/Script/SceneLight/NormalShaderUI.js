var SceneLightManager = require('SceneLightManager');
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {
        //超出光照范围时显示的比例
        minLightNum: 0.5,
        //是否启动遮挡检测
        useShadowJudge: 0,
        //原图
        spriteFrame: {
            default: null,
            type: cc.SpriteFrame
        }
    },

    // use this for initialization
    onLoad: function () {
        SceneLightManager.setLightNodeShader(Shader.getShaderByName("NormalShader"), this.node, this.minLightNum, this.useShadowJudge, this.spriteFrame);
        this.node.active = false;
    },

    onDestroy: function () {

    },
});
