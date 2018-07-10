/**
 * Emboss 效果: 浮雕 
 * 原理: 图像的前景前向凸出背景。把象素和左上方的象素进行求差运算，并加上一个背景颜色
 */
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {
        //浮雕的背景颜色
        embossColor: new cc.Color(0, 0, 0),

        _glProgram: null
    },

    // use this for initialization
    onLoad: function () {
        //获取一个像素对应的openGL数值
        let width = this.node.width;
        let height = this.node.height;

        this._glProgram = Shader.getShaderByName("EmbossEffect");
        this._glProgram.setUniformLocationWith1f("oneWidth", 1 / width);
        this._glProgram.setUniformLocationWith1f("oneHeight", 1 / height);
        this._glProgram.setUniformLocationWith3f("embossColor", this.embossColor.r / 255, this.embossColor.g / 255, this.embossColor.b / 255);
        this._glProgram.useInNode(this.node.getComponent(cc.Sprite));
    },

    onDestroy: function () {

    },
});
