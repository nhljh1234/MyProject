using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UGUI_Adaptation : MonoBehaviour
{

    public RectTransform rectTransform;
    // Use this for initialization
    void Start()
    {
        TJ_UNITY_TOOL.RectTransformTool.setWorldPosition(rectTransform, 667, 375);
    }

    // Update is called once per frame
    void Update()
    {

    }
}
