using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using UnityEngine.Rendering;

public class MenuScript
{
    [MenuItem("SRP/CreateSPR_1")]
    public static void CreateSPR_1()
    {
        var instance = ScriptableObject.CreateInstance<SRPAsset_1>();
        AssetDatabase.CreateAsset(instance, "Assets/SRP/SPR_1.asset");
        GraphicsSettings.renderPipelineAsset = instance;
    }

    [MenuItem("SRP/CreateSPR_2")]
    public static void CreateSPR_2()
    {
        var instance = ScriptableObject.CreateInstance<SRPAsset_2>();
        AssetDatabase.CreateAsset(instance, "Assets/SRP/SPR_2.asset");
        GraphicsSettings.renderPipelineAsset = instance;
    }
}
