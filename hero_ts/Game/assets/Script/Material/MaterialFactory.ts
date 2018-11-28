import { RenderEffect } from "./EffectFactory";
import { RenderTechnique } from "./TechniqueFactory";

export class RenderMaterial {
    _effect: RenderEffect;
    _mainTech: RenderTechnique;
    _texIds: Object;
    _hash: string;

    updateHash() {
        
    }

    _updateMaterial() {
        
    }
}

export function buildMaterial (persist: boolean = false) {
    return new cc.renderer.renderEngine.Material(persist);
};