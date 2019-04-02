using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class UGUI : MonoBehaviour
{

    public RectTransform rectTransform = null;

    // Use this for initialization
    void Start()
    {
        //TJ_UNITY_TOOL.RectTransformTool.setLocalPosition(rectTransform, 100, 100);
        rectTransform.GetComponent<Button>().onClick.AddListener(() =>
        {
            print("sssssss");
        });
        rectTransform.localPosition = new Vector3(200f, 200f, 0);
    }

    // Update is called once per frame
    void Update()
    {

    }
}