/**
 * shader模块，实现一些特殊效果
 */
var outModule = {};
var local = {};

local.shaderSave = {};

/**
 * 封装一个shader
 * @param {String} shaderName 
 * 顶点着色器的代码都是 shaderName + "Vertex"
 * 片段着色器的代码都是 shaderName + "Fragment"
 * @returns {cc.GLProgram}
 */
local.createTJShader = function (shaderName) {
    //先初始化glProgram
    let vertexName = shaderName + "Vertex";
    let fragmentName = shaderName + "Fragment";
    let vertexCode = require(vertexName).getCodeStr();
    let fragmentCode = require(fragmentName).getCodeStr();
    this.glProgram = new cc.GLProgram();
    if (cc.sys.isNative) {
        this.glProgram.initWithString(vertexCode, fragmentCode);
    } else {
        this.glProgram.initWithVertexShaderByteArray(vertexCode, fragmentCode);
        this.glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
        this.glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
        this.glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
    }
    this.UniformLocationNameObj = {};
    this.glProgramState = undefined;
    //封装一些定义
    //初始化
    this.init = function () {
        this.glProgram.link();
        this.glProgram.updateUniforms();
        //this.glProgram.use();
        if (cc.sys.isNative) {
            this.glProgramState = cc.GLProgramState.getOrCreateWithGLProgram(this.glProgram);
        }
    };
    this.use = function () {
        this.glProgram.use();
        //this.glProgram.updateUniforms();
    };
    this.updateUniforms = function () {
        this.glProgram.updateUniforms();
    };
    /**
     * 在指定节点上使用着色器
     * @param {cc.Sprite} node 
     */
    this.useInNode = function (node) {
        if (node._sgNode) {
            node._sgNode.setShaderProgram(this.glProgram);
        } else {
            cc.log('_sgNode is undefined');
        }
    };

    /**
     * 更新着色器
     * 需要在更新着色器后再使用
     */
    this.setUniformLocationWith1i = function (name, value) {
        this.use();
        if (cc.sys.isNative) {
            this.glProgramState.setUniformInt(name, value);
        } else {
            let uniformName = this.UniformLocationNameObj[name];
            if (!uniformName) {
                uniformName = this.glProgram.getUniformLocationForName(name);
                this.UniformLocationNameObj[name] = uniformName;
            }
            this.glProgram.setUniformLocationWith1i(uniformName, value);
        }
    };
    this.setUniformLocationWith1f = function (name, value) {
        this.use();
        if (cc.sys.isNative) {
            this.glProgramState.setUniformFloat(name, value);
        } else {
            let uniformName = this.UniformLocationNameObj[name];
            if (!uniformName) {
                uniformName = this.glProgram.getUniformLocationForName(name);
                this.UniformLocationNameObj[name] = uniformName;
            }
            this.glProgram.setUniformLocationWith1f(uniformName, value);
        }
    };
    this.setUniformLocationWith2f = function (name, value_1, value_2) {
        this.use();
        if (cc.sys.isNative) {
            this.glProgramState.setUniformVec2(name, {
                x: value_1,
                y: value_2
            });
        } else {
            let uniformName = this.UniformLocationNameObj[name];
            if (!uniformName) {
                uniformName = this.glProgram.getUniformLocationForName(name);
                this.UniformLocationNameObj[name] = uniformName;
            }
            this.glProgram.setUniformLocationWith2f(uniformName, value_1, value_2);
        }
    };
    this.setUniformLocationWith3f = function (name, value_1, value_2, value_3) {
        this.use();
        if (cc.sys.isNative) {
            this.glProgramState.setUniformVec3(name, {
                x: value_1,
                y: value_2,
                z: value_3
            });
        } else {
            let uniformName = this.UniformLocationNameObj[name];
            if (!uniformName) {
                uniformName = this.glProgram.getUniformLocationForName(name);
                this.UniformLocationNameObj[name] = uniformName;
            }
            this.glProgram.setUniformLocationWith3f(uniformName, value_1, value_2, value_3);
        }
    };
    this.setUniformLocationWith4f = function (name, value_1, value_2, value_3, value_4) {
        this.use();
        if (cc.sys.isNative) {
            this.glProgramState.setUniformVec3(name, {
                x: value_1,
                y: value_2,
                z: value_3,
                w: value_4
            });
        } else {
            let uniformName = this.UniformLocationNameObj[name];
            if (!uniformName) {
                uniformName = this.glProgram.getUniformLocationForName(name);
                this.UniformLocationNameObj[name] = uniformName;
            }
            this.glProgram.setUniformLocationWith4f(uniformName, value_1, value_2, value_3, value_4);
        }
    };

    this.bindTexture = function (name, texture, imgCount) {
        if (!cc.sys.isNative) {
            cc.gl.bindTexture2DN(imgCount, texture);
            this.setUniformLocationWith1i(name, imgCount);
        } else {
            this.setUniformTexture(name, texture);
        }
    };

    this.clear = function () {
        this.UniformLocationNameObj = {};
    };

    //执行初始化
    this.init();
};

/**
 * 获取指定的shader
 * @param {String} shaderName 
 * 定点着色器的代码都是 shaderName + "Vertex"
 * 片段着色器的代码都是 shaderName + "Fragment"
 * @returns {cc.GLProgram}
 */
outModule.getShaderByName = (shaderName) => {
    return new local.createTJShader(shaderName);
};

outModule.RADIAN_NUM = 0.01745329252;

outModule.COW_NUM = 3.1415926;

module.exports = outModule;