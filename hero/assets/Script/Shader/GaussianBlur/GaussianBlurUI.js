/**
 * 高斯模糊
 * 需要吧这个控件挂在脚本上
 */
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        var precisionIn = 360 / this.looperAmount;
        this._glProgram = Shader.getShaderByName("GaussianBlur");
        this._glProgram.setUniformLocationWith1f("oneWidth", 1 / this.node.width);
        this._glProgram.setUniformLocationWith1f("oneHeight", 1 / this.node.height);
        this._glProgram.useInNode(this.node.getComponent(cc.Sprite));
    },

    onDestroy: function () {

    },
});
