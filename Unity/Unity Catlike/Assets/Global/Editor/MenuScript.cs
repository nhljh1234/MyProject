using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using UnityEngine.Rendering;
using System;

public class MenuScript
{
    [MenuItem("SRP/SPR1/CreateSPR_1")]
    public static void CreateSPR_1()
    {
        var instance = ScriptableObject.CreateInstance<Scriptable_Render_Pipeline_1_Asset>();
        AssetDatabase.CreateAsset(instance, "Assets/Project/Scriptable_Render_Pipeline_1/Scriptable_Render_Pipeline_1.asset");
        GraphicsSettings.renderPipelineAsset = instance;
    }

    [MenuItem("SRP/SPR2/CreateSPR_2")]
    public static void CreateSPR_2()
    {
        var instance = ScriptableObject.CreateInstance<Scriptable_Render_Pipeline_2_Asset>();
        AssetDatabase.CreateAsset(instance, "Assets/Project/Scriptable_Render_Pipeline_2/Scriptable_Render_Pipeline_2.asset");
        GraphicsSettings.renderPipelineAsset = instance;
    }

    [MenuItem("SRP/SPR3/CreateSPR_3")]
    public static void CreateSPR_3()
    {
        var instance = ScriptableObject.CreateInstance<Scriptable_Render_Pipeline_3_Asset>();
        AssetDatabase.CreateAsset(instance, "Assets/Project/Scriptable_Render_Pipeline_3/Scriptable_Render_Pipeline_3.asset");
        GraphicsSettings.renderPipelineAsset = instance;
    }

    [MenuItem("SRP/Tool/CreateSphere")]
    public static void SPR2_CreateSphere()
    {
        GameObject go = GameObject.Find("GameObject");
        if (go.transform.childCount > 1)
        {
            return;
        }
        Transform tempSphere = go.transform.Find("Sphere");
        for (int i = 0; i < 255; i++)
        {
            Transform newSphere = GameObject.Instantiate(tempSphere.gameObject).transform;
            float posX, posY, posZ, scale;
            byte[] buffer = Guid.NewGuid().ToByteArray();
            int iSeed = BitConverter.ToInt32(buffer, 0);
            System.Random random = new System.Random(iSeed);
            posX = (float)(random.NextDouble() * 8 - 4);
            posY = (float)(random.NextDouble() * 8 - 4);
            posZ = (float)(random.NextDouble() * 2 - 1);
            scale = (float)(random.NextDouble());
            newSphere.SetParent(go.transform);
            newSphere.localPosition = new Vector3(posX, posY, posZ);
            newSphere.localScale = new Vector3(scale, scale, scale);
        }
    }
}
