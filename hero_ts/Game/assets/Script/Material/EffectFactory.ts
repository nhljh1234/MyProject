/**
 * 一个绘制过程就是
 * 1.先遍历technique的_parameters参数，把每个参数通过setUniform设置到着色器中
 * 取值是通过effect.getProperty() -> parameter.val -> defaultValue[parameter.type]的顺序
 * 2.遍历pass绘制
 */

import { RenderTechnique } from "./TechniqueFactory";
import { getSystemBuildFlag } from "./ShaderManager";

export interface RenderEffectDefines {
    name: string;
    value: any;
}

export class RenderEffect {
    _techniques: RenderTechnique[];
    _properties: { [key: string]: any };
    _defines: RenderEffectDefines[];

    clear() {

    }

    //获取对应的Technique
    getTechnique(stage: string[]): RenderTechnique {
        return undefined;
    }

    getProperty(name: string) {
        
    }

    setProperty(name: string, value: any) {

    }

    getDefine(name: string) {

    }

    //改变已经定义的define的值
    define(name, value) {

    }

    //遍历所有的define把值附加到out上
    extractDefines(out = {}) {

    }
}

export function buildEffect(techniques: RenderTechnique[], properties: { [key: string]: any }, defines: RenderEffectDefines[]) {
    if (!getSystemBuildFlag()) {
        return;
    }
    return new cc.renderer.renderEngine.renderer.Effect(techniques, properties, defines);
}