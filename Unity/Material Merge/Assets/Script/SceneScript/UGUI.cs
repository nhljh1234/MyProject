using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UGUI : MonoBehaviour
{

    public RectTransform rectTransform = null;

    // Use this for initialization
    void Start()
    {
        TJ_UNITY_TOOL.RectTransformTool.setLocalPosition(rectTransform, 100, 100);
    }

    // Update is called once per frame
    void Update()
    {

    }
}