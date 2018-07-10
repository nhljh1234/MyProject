/**
 * 线性水波纹效果
 * 需要吧这个控件挂在脚本上
 */
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {
        //水波数量
        waveNum: 6,
        //波动幅度
        waveMoveNum: 0.002,
        //波动速度
        speed: 0.015,

        //位移量
        _posX: null
    },

    // use this for initialization
    onLoad: function () {
        this._posX = 0;
        this._glProgram = Shader.getShaderByName("WaterWaveLineEffect");
        this._glProgram.setUniformLocationWith1f("waveNum", this.waveNum);
        this._glProgram.setUniformLocationWith1f("waveMoveNum", this.waveMoveNum);
        this._glProgram.setUniformLocationWith1f("addX", this._posX);
        this._glProgram.useInNode(this.node.getComponent(cc.Sprite));

        this.schedule(function () {
            this._glProgram.clear();
            this._glProgram.setUniformLocationWith1f("addX", this._posX);
            this._posX = this._posX + 0.1;
            if (this._posX >= 2 * Shader.COW_NUM) {
                this._posX = 0;
            }
        }.bind(this), this.speed, cc.macro.REPEAT_FOREVER);
    },

    onDestroy: function () {
        this.unscheduleAllCallbacks();
    },
});
