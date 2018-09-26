var outModule = {};
var local = {};

var Shader = require('Shader');

local.lightDataArr = [];
local.lightShaderArr = [];
local.shadowArr = [];

local.GroundNodeShader;
local.GroundNode;
local.GroundReduceNum;
local.GroundAntiAliasingNum;
local.GroundUseShadowMath;
local.GroundNormalSpriteFrame;


//所有物体渲染出来的一张图
local.TotalNodeShader;
local.TotalShaderMinNum;
local.TotalNode;

//环境光照
local.envLightColor = new cc.Color(0.0, 0.0, 0.0);

//构建一个3D坐标
local.buildVec3Data = (x, y, z) => {
    return { x: x, y: y, z: z }
};

//绘制设定的带法线贴图的物体
local.drawNormalNode = () => {
    let lightCount = 0;
    local.lightShaderArr.forEach((shaderData) => {
        shaderData.shader.use();
        shaderData.shader.clear();
        lightCount = 0;
        for (let i = 0; i < 3 && i < local.lightDataArr.length; i++) {
            let lightData = local.lightDataArr[i];
            let zNum = window.global ? (window.global.z / 10) : lightData.pos.z;
            //shaderData.shader.setUniformLocationWith3f("lightPos_" + (i + 1),
            //    lightData.pos.x, lightData.pos.y, lightData.pos.z);
            shaderData.shader.setUniformLocationWith3f("lightPos_" + (i + 1),
                lightData.pos.x, lightData.pos.y, zNum);
            shaderData.shader.setUniformLocationWith3f("lightColor_" + (i + 1),
                lightData.color.r / 255, lightData.color.g / 255, lightData.color.b / 255);
            shaderData.shader.setUniformLocationWith1f("lightWidth_" + (i + 1), lightData.lightWidth);
            shaderData.shader.setUniformLocationWith1f("lightStrength_" + (i + 1), lightData.lightStrength);
            shaderData.shader.setUniformLocationWith1f("lightAttenuation_" + (i + 1), lightData.lightAttenuation);
            lightCount++;
        }
        shaderData.shader.setUniformLocationWith1i("lightNum", lightCount);
        shaderData.shader.setUniformLocationWith3f("envLightColor",
            local.envLightColor.r / 255, local.envLightColor.g / 255, local.envLightColor.b / 255);
        shaderData.shader.setUniformLocationWith1i("useShadowMath", shaderData.useShadowMath);
        shaderData.shader.setUniformLocationWith2f("ResolutionSize", shaderData.node.width, shaderData.node.height);
        shaderData.shader.setUniformLocationWith2f("ResolutionPos", shaderData.node.x, shaderData.node.y);
        shaderData.shader.setUniformLocationWith1f("AntiAliasingNum", shaderData.AntiAliasingNum);
        shaderData.shader.setUniformLocationWith1i("tiltNum", shaderData.tiltNum);
        //加入法线贴图
        if (!cc.sys.isNative) {
            cc.gl.bindTexture2DN(1, shaderData.normalSpriteFrame.getTexture());
            shaderData.shader.setUniformLocationWith1i("texture", 1);
        } else {
            shaderData.shader.setUniformTexture("texture", shaderData.normalSpriteFrame.getTexture());
        }
        shaderData.shader.useInNode(shaderData.node.getComponent(cc.Sprite));
    });
};

//斜切阴影
local.drawSkewShadow = () => {
    //阴影
    let lightData = local.lightDataArr[0];
    let zNum = window.global ? (window.global.z / 10) : lightData.pos.z;
    local.shadowArr.forEach((oneData) => {
        let node = oneData.node;
        let data = oneData.data;
        let centerX, centerY;
        //这个坐标值需要和光源坐标值保持一致
        centerX = oneData.node.parent.x;
        centerY = oneData.node.parent.y;
        //计算角度
        let dis = Math.sqrt((lightData.pos.x - centerX) * (lightData.pos.x - centerX) +
            (lightData.pos.y - centerY) * (lightData.pos.y - centerY));
        if (dis > lightData.lightWidth) {
            node.active = false;
            return;
        }
        let opacity = (1 - (dis / lightData.lightWidth)) * 255 + 30;
        node.opacity = opacity;
        node.active = true;
        if (lightData.pos.y > centerY) {
            node.rotation = 180;
            node.scaleX = -1 * data.scaleX;
        } else {
            node.rotation = 0;
            node.scaleX = data.scaleX;
        }
        let angle;
        if (lightData.pos.x < centerX) {
            angle = (centerX - lightData.pos.x) / dis;
            angle = Math.asin(angle) / 2 / Math.PI * 360;
            angle = angle > 80 ? 80 : angle;
            node.skewX = angle;
        } else {
            angle = (lightData.pos.x - centerX) / dis;
            angle = Math.asin(angle) / 2 / Math.PI * 360;
            angle = angle > 80 ? 80 : angle;
            node.skewX = -1 * angle;
        }
        //对height进行处理
        let heightRatio = 1;
        node.height = data.height;
        const mathAngle = 60;
        if (angle > mathAngle) {
            heightRatio = (angle - mathAngle) / (90 - mathAngle);
            node.height = node.height * (1 - heightRatio);
        }
        node.height = node.height / (zNum < 1 ? 1 : zNum);
    });
};

local.drawGround = () => {
    if (local.GroundNodeShader) {
        let lightCount = 0;
        local.GroundNodeShader.use();
        local.GroundNodeShader.clear();
        for (let i = 0; i < 3 && i < local.lightDataArr.length; i++) {
            let lightData = local.lightDataArr[i];
            let zNum = window.global ? (window.global.z / 10) : lightData.pos.z;
            //shaderData.shader.setUniformLocationWith3f("lightPos_" + (i + 1),
            //    lightData.pos.x, lightData.pos.y, lightData.pos.z);
            local.GroundNodeShader.setUniformLocationWith3f("lightPos_" + (i + 1),
                lightData.pos.x, lightData.pos.y, zNum);
            local.GroundNodeShader.setUniformLocationWith3f("lightColor_" + (i + 1),
                lightData.color.r / 255, lightData.color.g / 255, lightData.color.b / 255);
            local.GroundNodeShader.setUniformLocationWith1f("lightWidth_" + (i + 1), lightData.lightWidth);
            local.GroundNodeShader.setUniformLocationWith1f("lightStrength_" + (i + 1), lightData.lightStrength);
            lightCount++;
        }
        local.GroundNodeShader.setUniformLocationWith1i("lightNum", lightCount);
        local.GroundNodeShader.setUniformLocationWith1f("reduceNum", local.GroundReduceNum);
        local.GroundNodeShader.setUniformLocationWith1f("AntiAliasingNum", local.GroundAntiAliasingNum);
        local.GroundNodeShader.setUniformLocationWith3f("envLightColor",
            local.envLightColor.r / 255, local.envLightColor.g / 255, local.envLightColor.b / 255);
        local.GroundNodeShader.setUniformLocationWith2f("ResolutionSize",
            local.GroundNode.width, local.GroundNode.height);
        //加入法线贴图
        if (!cc.sys.isNative) {
            cc.gl.bindTexture2DN(1, local.GroundNormalSpriteFrame.getTexture());
            local.GroundNodeShader.setUniformLocationWith1i("texture", 1);
        } else {
            local.GroundNodeShader.setUniformTexture("texture", local.GroundNormalSpriteFrame.getTexture());
        }
        local.GroundNodeShader.useInNode(local.GroundNode.getComponent(cc.Sprite));
    }
};

//设置环境光
outModule.setEnvLight = (color) => {
    local.envLightColor = color;
};

outModule.lightDataArrClear = () => {
    local.lightDataArr = [];
};

outModule.getLightDataArr = () => {
    return local.lightDataArr;
};

outModule.setBgNode = (shader, node, reduceNum, AntiAliasingNum, useShadowMath, normalSpriteFrame) => {
    local.GroundNodeShader = shader;
    local.GroundNode = node;
    local.GroundReduceNum = reduceNum;
    local.GroundAntiAliasingNum = AntiAliasingNum;
    local.GroundUseShadowMath = useShadowMath;
    local.GroundNormalSpriteFrame = normalSpriteFrame;
};

outModule.setTotalNode = (shader, node, minNum) => {
    local.TotalNodeShader = shader;
    local.TotalShaderMinNum = minNum;
    local.TotalNode = node;
};

outModule.addShadow = (node, data) => {
    local.shadowArr.push({
        node: node,
        data: data
    });
};

//设置点光源的方向
outModule.addLight = (x, y, z, lightColor, lightWidth, node, lightStrength, lightAttenuation) => {
    local.lightDataArr.push({
        pos: local.buildVec3Data(x, y, z),
        color: lightColor,
        lightWidth: lightWidth,
        lightWidthSave: lightWidth,
        node: node,
        lightStrength: lightStrength,
        lightStrengthSave: lightStrength,
        lightAttenuation: lightAttenuation
    });
};

//加入一个需要光照渲染的结点
outModule.addNormalNode = (shader, node, AntiAliasingNum, tiltNum, useShadowMath, normalSpriteFrame) => {
    local.lightShaderArr.push({
        shader: shader,
        node: node,
        AntiAliasingNum: AntiAliasingNum,
        tiltNum: tiltNum,
        useShadowMath: useShadowMath,
        normalSpriteFrame: normalSpriteFrame
    });
};

//绘制一个光照节点
outModule.drawLight = () => {
    //光照
    local.drawNormalNode();
    //斜切阴影
    local.drawSkewShadow();
    //地表
    local.drawGround();
};

module.exports = outModule;