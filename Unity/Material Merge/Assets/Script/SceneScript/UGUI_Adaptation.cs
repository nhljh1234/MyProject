using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UGUI_Adaptation : MonoBehaviour
{

    public RectTransform rectTransform;
    // Use this for initialization
    void Start()
    {
        TJ_UNITY_TOOL.RectTransformTool.setWorldPosition(rectTransform, 1334, 750);
        RectTransform parent = rectTransform.parent.GetComponent<RectTransform>();
        print(TJ_UNITY_TOOL.RectTransformTool.getWorldLeftBottomPos(parent));
        print(TJ_UNITY_TOOL.RectTransformTool.getSize(parent));
        //print(TJ_UNITY_TOOL.RectTransformTool.getLocalLeftBottomPos(parent));
        //print(TJ_UNITY_TOOL.RectTransformTool.getLocalLeftBottomPos(rectTransform));
        //print(TJ_UNITY_TOOL.RectTransformTool.getWorldLeftBottomPos(rectTransform));
        //print(TJ_UNITY_TOOL.RectTransformTool.getLocalPosition(rectTransform));
    }

    // Update is called once per frame
    void Update()
    {

    }
}
