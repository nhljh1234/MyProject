/**
 * 云层
 * 需要吧这个控件挂在脚本上
 */
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {
        //天空颜色
        skyColor: new cc.Color(0.5, 0.5, 0.5),
        //云层颜色
        cloudColor: new cc.Color(1, 1, 1),
        //云层尺寸
        cloudSize: 10,
        //速度
        speed: 0.01,

        _time: null,
    },

    // use this for initialization
    onLoad: function () {
        this._time = 0;

        this._glProgram = Shader.getShaderByName("SkyEffect");
        this._glProgram.setUniformLocationWith3f("skyColor", this.skyColor.r / 255, this.skyColor.g / 255, this.skyColor.b / 255);
        this._glProgram.setUniformLocationWith3f("cloudColor", this.cloudColor.r / 255, this.cloudColor.g / 255, this.cloudColor.b / 255);
        this._glProgram.setUniformLocationWith1f("cloudSize", this.cloudSize);
        this._glProgram.setUniformLocationWith1f("time", this._time);
        this._glProgram.useInNode(this.node.getComponent(cc.Sprite));

        this.schedule(function () {
            this._glProgram.clear();
            this._time = this._time + this.speed;
            this._glProgram.setUniformLocationWith1f("time", this._time);
        }.bind(this), 0.04, cc.macro.REPEAT_FOREVER);
    },

    onDestroy: function () {
        this.unscheduleAllCallbacks();
    },
});
