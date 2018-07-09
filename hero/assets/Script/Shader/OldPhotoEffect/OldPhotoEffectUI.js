/**
 * OldPhoto效果
 * r = 0.393*r + 0.769*g + 0.189*b; g = 0.349*r + 0.686*g + 0.168*b; b = 0.272*r + 0.534*g + 0.131*b; 
 */
var Shader = require('Shader');
cc.Class({
    extends: cc.Component,

    properties: {
        _glProgram: null
    },

    // use this for initialization
    onLoad: function () {
        this._glProgram = Shader.getShaderByName("OldPhotoEffect");
        this._glProgram.useInNode(this.node.getComponent(cc.Sprite));
    },

    onDestroy: function () {

    },
});
