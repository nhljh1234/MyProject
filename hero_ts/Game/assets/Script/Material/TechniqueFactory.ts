import { RenderPass } from "./PassFactory";
import { RenderEnum } from "./ProgramEnum";
import { getSystemBuildFlag } from "./ShaderManager";

/**
 * Technique就是
 */

export interface RenderTechniqueParameter {
    name: string;
    type: RenderEnum;
    //默认值addShader
    val: any;
}

export class RenderTechnique {
    //这个id是自增的
    _id: number;
    _stageIDs: number;
    //参数列表
    _parameters: number;
    //pass列表
    _passes: RenderPass[];
    _layer: any;

    //拷贝一个technique的数据
    copy(technique: RenderTechnique) {

    }

    setStages(stages) {

    }
}

export function buildTechnique(stages: string[], parameters: RenderTechniqueParameter[], passes: RenderPass[], layer: any) {
    if (!getSystemBuildFlag()) {
        return;
    }
    return new cc.renderer.renderEngine.renderer.Technique(stages, parameters, passes, layer);
}