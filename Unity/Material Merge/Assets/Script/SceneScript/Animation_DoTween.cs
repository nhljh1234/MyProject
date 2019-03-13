using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using DG.Tweening;

public class Animation_DoTween : MonoBehaviour
{

    public RectTransform rectTransform;
    public RectTransform aniTrans;
    // Use this for initialization
    void Start()
    {
        string finishStr = "finish";
        rectTransform.DOLocalMove(new Vector3(0, 0, 0), 1);
        TJ_UNITY_TOOL.DoTweenTool.FadeUI(aniTrans, 1.0f, 0, () =>
        {
            print(finishStr);
        });
    }

    // Update is called once per frame
    void Update()
    {

    }
}
