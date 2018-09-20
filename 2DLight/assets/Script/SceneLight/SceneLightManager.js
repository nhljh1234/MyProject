var outModule = {};
var local = {};

var Shader = require('Shader');

local.lightDataArr = [];
local.lightShaderArr = [];
local.shadowArr = [];

local.GroundNodeShader;
local.GroundShaderMinNum;
local.GroundNode;
local.GroundMinColorNum;
outModule.GroundMinColorNum;

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

outModule.changeGroundMinColorNum = (minNum) => {
    local.GroundMinColorNum = minNum;
};

outModule.setBgNode = (shader, node, minNum, minColorNum) => {
    local.GroundNodeShader = shader;
    local.GroundShaderMinNum = minNum;
    local.GroundNode = node;
    local.GroundMinColorNum = minColorNum;
    outModule.GroundMinColorNum = minColorNum;
};

outModule.setTotalNode = (shader, node, minNum) => {
    local.TotalNodeShader = shader;
    local.TotalShaderMinNum = minNum;
    local.TotalNode = node;
};

outModule.addShadow = (node, data, worldNode) => {
    local.shadowArr.push({
        node: node,
        data: data,
        worldNode: worldNode
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
    return;

    //阴影
    let lightData = local.lightDataArr[0];
    let zNum = window.global ? (window.global.z / 10) : lightData.pos.z;
    local.shadowArr.forEach((oneData) => {
        let node = oneData.node;
        let data = oneData.data;
        let centerX, centerY, worldPos;
        worldPos = node.convertToWorldSpace(cc.v2(node.x, node.y));
        centerX = worldPos.x + oneData.worldNode.x;
        centerY = worldPos.y + oneData.worldNode.y;
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

    //地表
    if (local.GroundNodeShader) {
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
        }
        local.GroundNodeShader.setUniformLocationWith1i("lightNum", lightCount);
        local.GroundNodeShader.setUniformLocationWith1f("minNum", local.GroundShaderMinNum);
        local.GroundNodeShader.setUniformLocationWith1f("minColorNum", local.GroundMinColorNum);
        local.GroundNodeShader.setUniformLocationWith2f("ResolutionSize",
            local.GroundNode.width, local.GroundNode.height);
        local.GroundNodeShader.useInNode(local.GroundNode.getComponent(cc.Sprite));
    }

    //所有物体
    if (local.TotalNodeShader) {
        local.TotalNodeShader.use();
        local.TotalNodeShader.clear();
        for (let i = 0; i < 3 && i < local.lightDataArr.length; i++) {
            let lightData = local.lightDataArr[i];
            let zNum = window.global ? (window.global.z / 10) : lightData.pos.z;
            //shaderData.shader.setUniformLocationWith3f("lightPos_" + (i + 1),
            //    lightData.pos.x, lightData.pos.y, lightData.pos.z);
            local.TotalNodeShader.setUniformLocationWith3f("lightPos_" + (i + 1),
                lightData.pos.x, lightData.pos.y, zNum);
            local.TotalNodeShader.setUniformLocationWith3f("lightColor_" + (i + 1),
                lightData.color.r / 255, lightData.color.g / 255, lightData.color.b / 255);
            local.TotalNodeShader.setUniformLocationWith1f("lightWidth_" + (i + 1), lightData.lightWidth);
        }
        local.TotalNodeShader.setUniformLocationWith1i("lightNum", lightCount);
        //local.GroundNodeShader.setUniformLocationWith1i("type", 2);
        local.TotalNodeShader.setUniformLocationWith1f("minNum", local.TotalShaderMinNum);
        local.TotalNodeShader.setUniformLocationWith2f("ResolutionSize",
            local.GroundNode.width, local.TotalNode.height);
        local.TotalNodeShader.useInNode(local.TotalNode.getComponent(cc.Sprite));
    }
};

module.exports = outModule;