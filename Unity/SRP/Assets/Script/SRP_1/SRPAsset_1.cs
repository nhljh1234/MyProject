using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Experimental.Rendering;

[ExecuteInEditMode]
public class SRPAsset_1 : RenderPipelineAsset
{
    protected override IRenderPipeline InternalCreatePipeline()
    {
        return new SRP_1();
    }
}
