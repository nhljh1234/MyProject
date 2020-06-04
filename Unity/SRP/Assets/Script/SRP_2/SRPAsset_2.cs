using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Experimental.Rendering;

[ExecuteInEditMode]
public class SRPAsset_2 : RenderPipelineAsset
{
    protected override IRenderPipeline InternalCreatePipeline()
    {
        return new SRP_2();
    }
}
