let materialSystemBuild = false;
let shaderBuildTaskArr = [];

//只有编译过的program才可以使用
export let shaderNameArr: string[] = [];

let initCb: Function;

/**
 * 编译缓存的program任务
 */
function buildProgramTask () {
    shaderBuildTaskArr.forEach(function (task: programData) {
        cc.renderer._forward._programLib.define(task.name, task.vert, task.frag, task.defines);
        if (shaderNameArr.indexOf(task.name) < 0) {
            shaderNameArr.push(task.name);
        }
    });
    shaderBuildTaskArr = [];
}

export function getSystemBuildFlag () {
    return materialSystemBuild;
}

export interface programDataDefines {
    name: string;
    //没搞懂这两个做什么的
    min: any;
    max: any;
}

export interface programData {
    name: string;
    //顶点着色器代码
    vert: string;
    //片段着色器代码
    frag: string;
    defines: programDataDefines[];
}

export function addShader (name: string, vert: string, frag: string, defines: programDataDefines[] = []) {
    if (materialSystemBuild) {
        //可以编译了
        cc.renderer._forward._programLib.define(name, vert, frag, defines);
        if (shaderNameArr.indexOf(name) < 0) {
            shaderNameArr.push(name);
        }
        return;
    }
    shaderBuildTaskArr.push({
        name: name,
        vert: vert,
        frag: frag,
        defines: defines
    });
}

export function addInitedCb (func: Function) {
    initCb = func;
}

//cc.game.EVENT_ENGINE_INITED 这个调用的时候才可以启用material
cc.game.once(cc.game['EVENT_ENGINE_INITED'], function () {
    materialSystemBuild = true;
    buildProgramTask();
    if (initCb) {
        initCb();
    }
});