/**
 * 应用流光效果
 * 需要吧这个控件挂在脚本上
 */
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {
        //外发光的颜色
        lightColor: new cc.Color(0, 0, 0),
        //外发光的宽度
        lightWidth: 0.3,

        _glProgram: null,

        //是否是外发光，如果传入false表示内发光
        isOutLight: true
    },

    // use this for initialization
    onLoad: function () {
        this._glProgram = Shader.getShaderByName("OutLightEffect");

        this._glProgram.setUniformLocationWith1i("isOutLight", this.isOutLight ? 1 : 0);
        this._glProgram.setUniformLocationWith1f("lightWidth", this.lightWidth);
        //this._glProgram.setUniformLocationWith1f("oneWidth", 1 / this.node.width);
        //this._glProgram.setUniformLocationWith1f("oneHeight", 1 / this.node.height);
        this._glProgram.setUniformLocationWith3f("lightColor", this.lightColor.r / 255, this.lightColor.g / 255, this.lightColor.b / 255);
        this._glProgram.useInNode(this.node.getComponent(cc.Sprite));
    },

    onDestroy: function () {

    },
});
