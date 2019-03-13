using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UGUI_Adaptation : MonoBehaviour
{

    public RectTransform rectTransform;
    // Use this for initialization
    void Start()
    {
        TJ_UNITY_TOOL.RectTransformTool.setWorldPositionByDesign(rectTransform, 1334, 750);
        //TJ_UNITY_TOOL.RectTransformTool.setLocalPosition(rectTransform, 200, 275);
    }

    // Update is called once per frame
    void Update()
    {

    }
}
