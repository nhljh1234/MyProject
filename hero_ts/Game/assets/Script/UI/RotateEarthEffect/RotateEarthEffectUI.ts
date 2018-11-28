import { RenderPass, buildPass } from "../../Material/PassFactory";
import { getSystemBuildFlag, addInitedCb, addShader } from "../../Material/ShaderManager";
import { RotateEarthEffectVertexCode } from "./RotateEarthEffectVertex";
import { RotateEarthEffectFragmentCode } from "./RotateEarthEffectFragment";
import { ProgramEnum, RenderEnum } from "../../Material/ProgramEnum";
import { buildTechnique } from "../../Material/TechniqueFactory";
import { RenderEffect, buildEffect } from "../../Material/EffectFactory";
import { RenderMaterial, buildMaterial } from "../../Material/MaterialFactory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MaterialUI extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    _material: RenderMaterial;
    _time: number = 0;

    start() {
        //新建pass
        if (getSystemBuildFlag()) {
            this.materialTest();
            return;
        }
        addInitedCb(this.materialTest);
    }

    materialTest() {
        //编译着色器
        addShader('RotateEarthEffect', RotateEarthEffectVertexCode, RotateEarthEffectFragmentCode, []);
        //新建Pass
        let pass: RenderPass = buildPass('RotateEarthEffect');
        pass.setDepth(false, false);
        pass.setCullMode(ProgramEnum.CULL_NONE);
        pass.setBlend(
            ProgramEnum.BLEND_FUNC_ADD,
            ProgramEnum.BLEND_SRC_ALPHA, ProgramEnum.BLEND_ONE_MINUS_SRC_ALPHA,
            ProgramEnum.BLEND_FUNC_ADD,
            ProgramEnum.BLEND_SRC_ALPHA, ProgramEnum.BLEND_ONE_MINUS_SRC_ALPHA
        );
        //新建Technique
        let technique = buildTechnique(['transparent'], [
            {
                name: 'ratio',
                type: RenderEnum.PARAM_FLOAT,
                val: this.sprite.node.width / this.sprite.node.height
            },
            {
                name: 'time',
                type: RenderEnum.PARAM_FLOAT,
                val: 0
            },
            {
                name: 'iTexture',
                type: RenderEnum.PARAM_TEXTURE_2D,
                val: this.sprite.spriteFrame.getTexture().getImpl()
            }
        ], [pass], undefined);
        //新建effect
        let effect: RenderEffect = buildEffect([technique], {
            'ratio': this.sprite.node.width / this.sprite.node.height
        }, []);
        //新建Material
        this._material = buildMaterial();
        //绑定到sprite上面
        //接下来这几步不能少
        //需要赋值两个地方，否则会出错
        this._material._effect = this._material.effect = effect;
        let texture = this.sprite.spriteFrame.getTexture();
        this._material._texture = texture;
        this._material._mainTech = technique;
        this.sprite['_updateMaterial'](this._material);

        //定时器函数
        this.schedule(function () {
            let material: RenderMaterial = this._material;
            this._time = this._time - 0.001;
            if (this._time < 0) {
                this._time = 1;
            }
            material._effect.setProperty('time', this._time);
        }.bind(this), 0.04, cc.macro.REPEAT_FOREVER);
    }


    onDestroy() {
        this.unscheduleAllCallbacks();
    }
}
