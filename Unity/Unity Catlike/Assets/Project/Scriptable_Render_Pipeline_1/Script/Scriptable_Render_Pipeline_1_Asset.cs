using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Experimental.Rendering;

[ExecuteInEditMode]
public class Scriptable_Render_Pipeline_1_Asset : RenderPipelineAsset
{
    protected override IRenderPipeline InternalCreatePipeline()
    {
        return new Scriptable_Render_Pipeline_1_RenderPipeline();
    }
}
