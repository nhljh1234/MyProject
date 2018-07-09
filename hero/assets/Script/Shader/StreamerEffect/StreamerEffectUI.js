/**
 * 外发光效果
 * 需要吧这个控件挂在脚本上
 */
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {
        //流光的颜色
        lightColor: new cc.Color(0, 0, 0),
        //流光的宽度
        lightWidth: 4,
        //流光的角度
        cow: 45,
        //播放速度
        speed: 0.01,
        //每次移动量
        add: 0.1,

        _posX: null,
        _glProgram: null
    },

    // use this for initialization
    onLoad: function () {
        this._posX = 0;

        //默认不能超过90度
        if (this.cow >= 90) {
            this.cow = 45;
        }

        //弧度转换
        this.cow = this.cow * Shader.RADIAN_NUM;

        if (this.lightWidth >= this.node.width) {
            this.lightWidth = this.node.width;
        }
        this.lightWidth = this.lightWidth / this.node.width;

        this._glProgram = Shader.getShaderByName("StreamerEffect");
        this._glProgram.setUniformLocationWith1f("lightWidth", this.lightWidth);
        this._glProgram.setUniformLocationWith1f("cow", this.cow);
        this._glProgram.setUniformLocationWith1f("startX", this._posX / this.node.width);
        this._glProgram.setUniformLocationWith3f("lightColor", this.lightColor.r / 255, this.lightColor.g / 255, this.lightColor.b / 255);
        this._glProgram.useInNode(this.node.getComponent(cc.Sprite));

        this.schedule(function () {
            this._glProgram.clear();
            this._glProgram.setUniformLocationWith1f("lightWidth", this.lightWidth);
            this._glProgram.setUniformLocationWith1f("cow", this.cow);
            this._glProgram.setUniformLocationWith1f("startX", this._posX / this.node.width);
            this._glProgram.setUniformLocationWith3f("lightColor", this.lightColor.r / 255, this.lightColor.g / 255, this.lightColor.b / 255);
            this._posX = this._posX + this.add * this.node.width;
            if (this._posX >= (this.node.width + this.node.height / Math.tan(this.cow))) {
                this._posX = 0;
            }
        }.bind(this), this.speed, cc.macro.REPEAT_FOREVER);
    },

    onDestroy: function () {
        this.unscheduleAllCallbacks();
    },
});
