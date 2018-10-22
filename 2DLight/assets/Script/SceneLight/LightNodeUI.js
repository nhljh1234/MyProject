var SceneLightManager = require('SceneLightManager');
cc.Class({
    extends: cc.Component,

    properties: {
        //光源的衰减系数，值越大衰减得越快
        lightAttenuation: 0.0005,
        //z深度
        z: 0,
        //光照颜色
        lightColor: new cc.Color(0.5, 0.5, 0.5),
        //光照范围
        lightWidth: 500,
        //光照强度
        lightStrengthSave: 4,
    },

    // use this for initialization
    onLoad: function () {
        SceneLightManager.addLight(this.node.x, this.node.y, this.z, this.lightColor,
            this.lightWidth, this.node, this.lightStrengthSave, this.lightAttenuation);
    },

    // called every frame
    update: function (dt) {

    },
});
