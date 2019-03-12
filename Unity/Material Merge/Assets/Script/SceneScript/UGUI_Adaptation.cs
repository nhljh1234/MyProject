using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UGUI_Adaptation : MonoBehaviour
{

	public RectTransform rectTransform;
    // Use this for initialization
    void Start()
    {
		TJ_UNITY_TOOL.RectTransformTool.setLocalPosition(rectTransform, 1334, 740);
		RectTransform panel = rectTransform.parent.GetComponent<RectTransform>();
		print(panel.parent.GetComponent<RectTransform>());
		print(TJ_UNITY_TOOL.RectTransformTool.getSize(panel));
		//print(TJ_UNITY_TOOL.RectTransformTool.getSize(rectTransform));
		print(TJ_UNITY_TOOL.RectTransformTool.getWorldLeftBottomPos(panel));
    }

    // Update is called once per frame
    void Update()
    {

    }
}
