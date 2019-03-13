using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
using DG.Tweening;

namespace TJ_UNITY_TOOL
{
    public class DoTweenTool
    {
        //隐藏整个界面
        public static void FadeUI(RectTransform trans, float duration, float to, TweenCallback callback)
        {
            //保证callback只会执行一次
            int count = 0;
            Component[] comps = trans.GetComponentsInChildren<Component>();
            //遍历
            for (int i = 0; i < comps.Length; i++)
            {
                Component oneComp = comps[i];
                if (oneComp is Graphic)
                {
                    count++;
                    (oneComp as Graphic).DOFade(to, duration).OnComplete(() =>
                    {
                        count--;
                        if (count == 0)
                        {
                            callback();
                        }
                    });
                }
            }
        }
    }
}