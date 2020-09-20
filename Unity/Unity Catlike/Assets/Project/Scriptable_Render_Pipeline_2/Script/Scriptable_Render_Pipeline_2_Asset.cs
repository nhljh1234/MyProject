using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Experimental.Rendering;

[ExecuteInEditMode]
public class Scriptable_Render_Pipeline_2_Asset : RenderPipelineAsset
{
    [SerializeField]
	public bool useDynamicBatching;
    [SerializeField]
	public bool useInstanceing;
    protected override IRenderPipeline InternalCreatePipeline()
    {
        return new Scriptable_Render_Pipeline_2_RenderPipeline(useDynamicBatching, useInstanceing);
    }
}
