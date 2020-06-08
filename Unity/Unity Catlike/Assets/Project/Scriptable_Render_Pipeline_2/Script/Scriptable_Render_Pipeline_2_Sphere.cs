using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Rendering;
using System;

public class Scriptable_Render_Pipeline_2_Sphere : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        byte[] buffer = Guid.NewGuid().ToByteArray();
        int iSeed = BitConverter.ToInt32(buffer, 0);
        System.Random random = new System.Random(iSeed);
        MaterialPropertyBlock materialPropertyBlock = new MaterialPropertyBlock();
        materialPropertyBlock.SetColor("_Color", new Color(
            (float)random.NextDouble(),
            (float)random.NextDouble(),
            (float)random.NextDouble(),
            1
        ));
        GetComponent<MeshRenderer>().SetPropertyBlock(materialPropertyBlock);
    }

    // Update is called once per frame
    void Update()
    {

    }
}
