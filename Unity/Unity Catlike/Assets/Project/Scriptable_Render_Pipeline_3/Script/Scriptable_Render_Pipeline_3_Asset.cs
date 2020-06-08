using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Experimental.Rendering;

[ExecuteInEditMode]
public class Scriptable_Render_Pipeline_3_Asset : RenderPipelineAsset
{
    [SerializeField]
	public bool useDynamicBatching;
    [SerializeField]
	public bool useInstanceing;
    protected override IRenderPipeline InternalCreatePipeline()
    {
        return new Scriptable_Render_Pipeline_3_RenderPipeline(useDynamicBatching, useInstanceing);
    }
}
