import { RenderEffect } from "./EffectFactory";
import { RenderTechnique } from "./TechniqueFactory";

export class RenderMaterial {
    effect: RenderEffect;
    _effect: RenderEffect;
    _mainTech: RenderTechnique;
    _texIds: Object;
    _hash: string;
    _texture: cc.Texture2D;

    updateHash() {
        
    }

    _updateMaterial() {
        
    }
}

export function buildMaterial (persist: boolean = false) {
    return new cc.renderer.renderEngine.Material(persist);
};