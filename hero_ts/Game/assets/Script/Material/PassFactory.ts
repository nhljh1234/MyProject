import { ProgramEnum } from "./ProgramEnum";
import { getSystemBuildFlag } from "./ShaderManager";

/**
 * material中的pass就和unity shader的pass类似，执行一个渲染步骤
 * Technique就是多个pass的集合体，按顺序执行pass
 */

/**
 * 方便代码提示
 */
export class RenderPass {
    _progressName: string;
    _cullMode: number; //CULL_BACK
    _blend: number; //false
    _blendEq: number;//BLEND_FUNC_ADD
    _blendAlphaEq: number;//BLEND_FUNC_ADD
    _blendSrc: number;//BLEND_ONE
    _blendDst: number;//BLEND_ZERO
    _blendSrcAlpha: number;//BLEND_ONE
    _blendDstAlpha: number;//BLEND_ZERO
    _blendColor: number;//0xffffffff

    //depth
    _depthTest: boolean;//false
    _depthWrite: boolean;//false
    _depthFunc: number;//DS_FUNC_LESS

    _stencilTest: boolean;//false
    _stencilFuncFront: number;//DS_FUNC_ALWAYS
    _stencilRefFront: number;//0
    _stencilMaskFront: number;//0xff
    _stencilFailOpFront: number;//STENCIL_OP_KEEP
    _stencilZFailOpFront: number;//STENCIL_OP_KEEP
    _stencilZPassOpFront: number;//STENCIL_OP_KEEP
    _stencilWriteMaskFront: number;//0xff

    _stencilFuncBack: number;//DS_FUNC_ALWAYS
    _stencilRefBack: number;//0
    _stencilMaskBack: number;//0xff
    _stencilFailOpBack: number;//STENCIL_OP_KEEP
    _stencilZFailOpBack: number;//STENCIL_OP_KEEP
    _stencilZPassOpBack: number;//STENCIL_OP_KEEP
    _stencilWriteMaskBack: number;//0xff

    //拷贝一个pass的数据
    copy(pass: RenderPass) {

    }

    //设置混合模式
    setBlend(
        blendEq: ProgramEnum = ProgramEnum.BLEND_FUNC_ADD,
        blendSrc: ProgramEnum = ProgramEnum.BLEND_ONE,
        blendDst: ProgramEnum = ProgramEnum.BLEND_ZERO,
        blendAlphaEq: ProgramEnum = ProgramEnum.BLEND_FUNC_ADD,
        blendSrcAlpha: ProgramEnum = ProgramEnum.BLEND_ONE,
        blendDstAlpha: ProgramEnum = ProgramEnum.BLEND_ZERO,
        blendColor = 0xffffffff
    ) {

    }

    //设置剔除模式
    setCullMode(cullMode: ProgramEnum) {

    }

    //设置深度测试相关值
    setDepth(depthTest: boolean = false, depthWrite: boolean = false, depthFunc: ProgramEnum = ProgramEnum.DS_FUNC_LESS) {

    }

    //设置模板测试相关值
    setStencilFront(
        stencilFunc: ProgramEnum = ProgramEnum.DS_FUNC_ALWAYS,
        stencilRef = 0,
        stencilMask = 0xff,
        stencilFailOp: ProgramEnum = ProgramEnum.STENCIL_OP_KEEP,
        stencilZFailOp: ProgramEnum = ProgramEnum.STENCIL_OP_KEEP,
        stencilZPassOp: ProgramEnum = ProgramEnum.STENCIL_OP_KEEP,
        stencilWriteMask = 0xff
    ) {

    }

    //设置模板测试相关值
    setStencilBack(
        stencilFunc: ProgramEnum = ProgramEnum.DS_FUNC_ALWAYS,
        stencilRef = 0,
        stencilMask = 0xff,
        stencilFailOp: ProgramEnum = ProgramEnum.STENCIL_OP_KEEP,
        stencilZFailOp: ProgramEnum = ProgramEnum.STENCIL_OP_KEEP,
        stencilZPassOp: ProgramEnum = ProgramEnum.STENCIL_OP_KEEP,
        stencilWriteMask = 0xff
    ) {

    }

    //禁用模板测试
    disableStencilTest() {

    }
}

/**
 * 新建一个pass
 * 用的就是Program中编译的着色器
 */
export function buildPass (programName: string): RenderPass {
    if (!getSystemBuildFlag()) {
        return;
    }
    return new cc.renderer.renderEngine.renderer.Pass(programName);
}