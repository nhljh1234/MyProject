using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

namespace TJ_UNITY_TOOL
{

    public class SceneRatioComponent : MonoBehaviour
    {

        void Awake()
        {
            RectTransform rectTransform = GetComponent<RectTransform>();
            if (!rectTransform)
            {
                return;
            }
            //重设锚点
            rectTransform.anchorMin = new Vector2(0, 0);
            rectTransform.anchorMax = new Vector2(1, 1);
            Vector2 marginNum = TJ_UNITY_TOOL.SceneRatioTool.getSceneMarginNum();
            bool isIPhoneX = TJ_UNITY_TOOL.SceneRatioTool.getIsIPhoneX();
            if (!isIPhoneX)
            {
                marginNum = new Vector2(0, 0);
            }
            if (TJ_UNITY_TOOL.SceneRatioTool.getSceneMode() == TJ_UNITY_TOOL.SceneRatioTool.SCENE_MODE.landscape)
            {
                //水平的时候
                rectTransform.offsetMin = new Vector2(marginNum.x, 0.0f);
                rectTransform.offsetMax = new Vector2(-1 * marginNum.y, 0.0f);
            }
            else
            {
                rectTransform.offsetMin = new Vector2(0.0f, marginNum.x);
                rectTransform.offsetMax = new Vector2(0.0f, -1 * marginNum.y);
            }
        }
    }
}