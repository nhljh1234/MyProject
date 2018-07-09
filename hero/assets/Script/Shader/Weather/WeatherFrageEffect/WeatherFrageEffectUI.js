/**
 * 高斯模糊
 * 需要吧这个控件挂在脚本上
 */
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {
        //雾气的颜色
        lightColor: new cc.Color(0, 0, 0),
        //雾气的中心点，这个点开始扩散
        midX: 0,
        midY: 0,
        //递减速度 0 - 1
        speed: 0.5,

        //是否是中间扩散
        isCenterBuild: false
    },

    // use this for initialization
    onLoad: function () {
        //坐标
        this.midX = this.midX / this.node.width;
        this.midY = this.midY / this.node.height;

        this._glProgram = Shader.getShaderByName("WeatherFrageEffect");
        this._glProgram.setUniformLocationWith3f("lightColor", this.lightColor.r / 255, this.lightColor.g / 255, this.lightColor.b / 255);
        this._glProgram.setUniformLocationWith1f("midX", this.midX);
        this._glProgram.setUniformLocationWith1f("midY", this.midY);
        this._glProgram.setUniformLocationWith1f("speed", this.speed);
        this._glProgram.setUniformLocationWith1i("isCenterBuild", this.isCenterBuild ? 1 : 0);
        this._glProgram.useInNode(this.node.getComponent(cc.Sprite));

        /**
        this.node.on('touchstart', function (event) {
            var point = event.currentTouch._point;
            this.midX = point.x / this.node.width;
            this.midY = 1 - (point.y / this.node.height);
            cc.log(this.midX);
            cc.log(this.midY);
            this._glProgram.setUniformLocationWith1f("midX", this.midX);
            this._glProgram.setUniformLocationWith1f("midY", this.midY);
        }.bind(this));
        **/

        var time = 0;

        this.schedule(function () {
            var y = this.midY + Math.sin(time % 360) / 3;
            this._glProgram.setUniformLocationWith1f("midY", y);
            time = time + 0.05;
        }.bind(this), 0.03, cc.macro.REPEAT_FOREVER);
    },

    onDestroy: function () {
        this.unscheduleAllCallbacks();
    },
});
