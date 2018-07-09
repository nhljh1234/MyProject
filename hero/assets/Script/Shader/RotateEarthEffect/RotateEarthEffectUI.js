/**
 * Emboss 效果: 球形
 * 将一个长方形的图纸装换为球形
 * 需要用到球面化算法 核心：曲率的平均扩散，原有的直径曲率化对应半个圆周，2R -> πr，系数k = 2 / π
 * https://blog.csdn.net/xeral/article/details/6593416
 */
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {
        _time: null,
        _glProgram: null,
        rotateSpeed: 1,
    },

    // use this for initialization
    onLoad: function () {
        this._glProgram = Shader.getShaderByName("RotateEarthEffect");
        this._glProgram.setUniformLocationWith1f("ratio", this.node.width / this.node.height);
        this._glProgram.setUniformLocationWith1f("time", this._time);
        this._glProgram.useInNode(this.node.getComponent(cc.Sprite));

        this.schedule(function () {
            this._glProgram.clear();
            this._time = this._time - 0.001 * this.rotateSpeed;
            if (this._time < 0) {
                this._time = 1;
            }
            this._glProgram.setUniformLocationWith1f("time", this._time);
        }.bind(this), 0.04, cc.macro.REPEAT_FOREVER);
    },

    onDestroy: function () {
        this.unscheduleAllCallbacks();
    },
});
