/**
 * 马赛克
 */
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {
        //马赛克的宽度，用像素计算
        mosaicWidth: 3,
        _glProgram: null,
    },

    // use this for initialization
    onLoad: function () {
        let oneWidth = 1 / this.node.width;
        let oneHeight = 1 / this.node.height;

        this.mosaicWidth = Math.ceil(this.mosaicWidth);

        if (this.mosaicWidth < 3) {
            this.mosaicWidth = 3;
        }

        this._glProgram = Shader.getShaderByName("MosaicEffect");
        this._glProgram.setUniformLocationWith1f("oneWidth", oneWidth);
        this._glProgram.setUniformLocationWith1f("oneHeight", oneHeight);
        this._glProgram.setUniformLocationWith1f("mosaicWidth", this.mosaicWidth);
        this._glProgram.useInNode(this.node.getComponent(cc.Sprite));
    },

    onDestroy: function () {

    },
});
