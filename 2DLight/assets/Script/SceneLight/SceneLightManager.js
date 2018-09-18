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

local.buildVec3Data = (x, y, z) => {
    return { x: x, y: y, z: z }
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

outModule.addShadow = (node, data) => {
    local.shadowArr.push({
        node: node,
        data: data
    });
};

//设置点光源的方向
outModule.addLight = (x, y, z, lightColor, lightWidth, node, diffNum) => {
    local.lightDataArr.push({
        pos: local.buildVec3Data(x, y, z),
        color: lightColor,
        lightWidth: lightWidth,
        lightWidthSave: lightWidth,
        node: node,
        diffNum: diffNum,
        diffNumSave: diffNum,
    });
};

//加入一个需要光照渲染的结点上绑定的shader
outModule.setLightNodeShader = (shader, node, minNum) => {
    local.lightShaderArr.push({
        shader: shader,
        node: node,
        minNum: minNum
    });
    node.active = false;
};

//绘制一个光照节点
outModule.drawLight = () => {
    //光照
    let lightCount = 0;
    local.lightShaderArr.forEach((shaderData) => {
        shaderData.shader.use();
        shaderData.shader.clear();
        shaderData.node.active = true;
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
            shaderData.shader.setUniformLocationWith1f("lightDiffNum_" + (i + 1), lightData.diffNum);
            lightCount++;
        }
        shaderData.shader.setUniformLocationWith1i("lightNum", lightCount);
        shaderData.shader.setUniformLocationWith1i("type", 1);
        shaderData.shader.setUniformLocationWith1f("minNum", shaderData.minNum);
        shaderData.shader.setUniformLocationWith2f("ResolutionSize",
            shaderData.node.width, shaderData.node.height);
        shaderData.shader.setUniformLocationWith2f("ResolutionPos",
            shaderData.node.x, shaderData.node.y);
        shaderData.shader.useInNode(shaderData.node.getComponent(cc.Sprite));
    });

    //阴影
    let lightData = local.lightDataArr[0];
    let zNum = window.global ? (window.global.z / 10) : lightData.pos.z;
    local.shadowArr.forEach((oneData) => {
        let node = oneData.node;
        let data = oneData.data;
        let centerX, centerY;
        centerX = node.x + node.parent.x;
        centerY = node.y + node.parent.y + data.height / 2;
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
        }
        local.GroundNodeShader.setUniformLocationWith1i("lightNum", lightCount);
        //local.GroundNodeShader.setUniformLocationWith1i("type", 2);
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