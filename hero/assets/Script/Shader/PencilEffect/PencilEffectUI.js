/**
 * PencilEffect 效果: 铅笔效果 
 * 实现矩阵
 * [
 *      -0.5, -1.0, 0.0,
        -1.0,  0.0, 1.0,
        0.0,  1.0, 0.5 
 * ]
 * 灰度计算
 * gl_FragColor.r * 0.3 + gl_FragColor.g * 0.59 + gl_FragColor.b * 0.11;
 */
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {
        //铅笔的颜色
        _glProgram: null
    },

    // use this for initialization
    onLoad: function () {
        //获取一个像素对应的openGL数值
        let width = this.node.width;
        let height = this.node.height;

        this._glProgram = Shader.getShaderByName("PencilEffect");
        this._glProgram.setUniformLocationWith1f("oneWidth", 1 / width);
        this._glProgram.setUniformLocationWith1f("oneHeight", 1 / height);
        this._glProgram.useInNode(this.node.getComponent(cc.Sprite));
    },

    onDestroy: function () {

    },
});
