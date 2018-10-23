/**
 * Dissolution 效果: 溶解
 * r + g + b + a < num的不显示
 */
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {
        //浮雕的背景颜色
        speed: 0.01,
        _num: null,
        _glProgram: null,
    },

    // use this for initialization
    onLoad: function () {
        //获取一个像素对应的openGL数值
        this._glProgram = Shader.getShaderByName("DissolutionEffect");
        this._num = 0;
        this._glProgram.useInNode(this.node.getComponent(cc.Sprite));
        this.schedule(function () {
            if (this._num > 1.2) {
                return;
            }
            this._glProgram.clear();
            this._num = this._num + this.speed;
            this._glProgram.setUniformLocationWith1f("num", this._num);
        }.bind(this), 0.03, cc.macro.REPEAT_FOREVER);
    },

    onDestroy: function () {
        this.unscheduleAllCallbacks();
    },
});
