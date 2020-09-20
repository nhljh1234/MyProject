using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Experimental.Rendering;
using UnityEngine.Rendering;
using Conditional = System.Diagnostics.ConditionalAttribute;

public class Scriptable_Render_Pipeline_3_RenderPipeline : RenderPipeline
{
    private Color m_ClearColor = Color.blue;
    private CullResults cull;
    private CommandBuffer cameraClearBuff = new CommandBuffer { name = "Render Camera" };
    private Material errorMaterial;
    private DrawRendererFlags drawFlags;

    public Scriptable_Render_Pipeline_3_RenderPipeline(bool useDynamicBatching, bool useInstanceing)
    {
        Shader errorShader = Shader.Find("Hidden/InternalErrorShader");
        errorMaterial = new Material(errorShader) { hideFlags = HideFlags.HideAndDontSave };
        if (useDynamicBatching)
        {
            drawFlags = DrawRendererFlags.EnableDynamicBatching;
        }
        if (useInstanceing)
        {
            drawFlags |= DrawRendererFlags.EnableInstancing;
        }
    }

    public override void Render(ScriptableRenderContext context, Camera[] cameras)
    {
        // does not so much yet :()
        base.Render(context, cameras);

        foreach (Camera camera in cameras)
        {
            RenderCamera(context, camera);
        }
    }

    [Conditional("DEVELOPMENT_BUILD"), Conditional("UNITY_EDITOR")]
    private void DrawDefaultPipeline(ScriptableRenderContext context, Camera camera)
    {
        DrawRendererSettings drawRendererSettings = new DrawRendererSettings(camera, new ShaderPassName("ForwardBase"));
        drawRendererSettings.SetShaderPassName(1, new ShaderPassName("PrepassBase"));
        drawRendererSettings.SetShaderPassName(2, new ShaderPassName("Always"));
        drawRendererSettings.SetShaderPassName(3, new ShaderPassName("Vertex"));
        drawRendererSettings.SetShaderPassName(4, new ShaderPassName("VertexLMRGBM"));
        drawRendererSettings.SetShaderPassName(5, new ShaderPassName("VertexLM"));
        drawRendererSettings.SetOverrideMaterial(errorMaterial, 0);
        drawRendererSettings.sorting.flags = SortFlags.CommonOpaque;
        FilterRenderersSettings filterRenderersSettings = new FilterRenderersSettings(true);
        context.DrawRenderers(cull.visibleRenderers, ref drawRendererSettings, filterRenderersSettings);
        context.Submit();
    }

    private void RenderCamera(ScriptableRenderContext context, Camera camera)
    {
        //设置摄像机属性给上下文
        context.SetupCameraProperties(camera);
        //清除背景
        CameraClearFlags clearFlags = camera.clearFlags;
        cameraClearBuff.ClearRenderTarget(
                    (clearFlags & CameraClearFlags.Depth) != 0,
                    (clearFlags & CameraClearFlags.Color) != 0,
                    camera.backgroundColor
                );
        context.ExecuteCommandBuffer(cameraClearBuff);
        cameraClearBuff.Clear();
        //剔除视图外的物体
        ScriptableCullingParameters cullingParameters;
        if (!CullResults.GetCullingParameters(camera, out cullingParameters))
        {
            return;
        }
#if UNITY_EDITOR
        if (camera.cameraType == CameraType.SceneView)
        {
            ScriptableRenderContext.EmitWorldGeometryForSceneView(camera);
        }
#endif
        CullResults.Cull(ref cullingParameters, context, ref cull);
        //绘制物体
        DrawOpaqueRenders(context, camera, cull);
        DrawDefaultPipeline(context, camera);
        context.DrawSkybox(camera);
        DrawTransparentRenders(context, camera, cull);
        context.Submit();
    }

    private void DrawOpaqueRenders(ScriptableRenderContext context, Camera camera, CullResults cull)
    {
        FilterRenderersSettings filterRenderersSettings = new FilterRenderersSettings(true);
        filterRenderersSettings.renderQueueRange = RenderQueueRange.opaque;
        DrawRendererSettings drawRendererSettings = new DrawRendererSettings(camera, new ShaderPassName("SRPDefaultUnlit"));
        drawRendererSettings.flags = drawFlags;
        drawRendererSettings.sorting.flags = SortFlags.CommonOpaque;
        context.DrawRenderers(cull.visibleRenderers, ref drawRendererSettings, filterRenderersSettings);
    }

    private void DrawTransparentRenders(ScriptableRenderContext context, Camera camera, CullResults cull)
    {
        FilterRenderersSettings filterRenderersSettings = new FilterRenderersSettings(true);
        filterRenderersSettings.renderQueueRange = RenderQueueRange.transparent;
        DrawRendererSettings drawRendererSettings = new DrawRendererSettings(camera, new ShaderPassName("SRPDefaultUnlit"));
        drawRendererSettings.flags = drawFlags;
        drawRendererSettings.sorting.flags = SortFlags.CommonTransparent;
        context.DrawRenderers(cull.visibleRenderers, ref drawRendererSettings, filterRenderersSettings);
    }
}
