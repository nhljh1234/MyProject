using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
using DG.Tweening;

namespace TJ_UNITY_TOOL
{
    //通过的UI界面逻辑
    public class ScenePanelComponent : MonoBehaviour
    {
        //播放动画中
        public bool inShowAni = false;
        //界面的根节点
        protected RectTransform _rectTransform = null;
        protected string _name = "";
        //初始化
        //被创建出来的时候会执行一次
        public virtual void onCreate(RectTransform rectTransform)
        {
            _rectTransform = rectTransform;
            _name = rectTransform.name;
        }
        //active从false->true的时候会执行一次
        public virtual void onShow()
        {

        }
        //active从true->false的时候会执行一次
        public virtual void onHide()
        {

        }
        //显示动画
        public void showAni(TweenCallback callback = null)
        {
            if (inShowAni)
            {
                return;
            }
            inShowAni = true;
            TJ_UNITY_TOOL.DoTweenTool.FadeUI(_rectTransform, 0, 0);
            TJ_UNITY_TOOL.DoTweenTool.FadeUI(_rectTransform, 2, 1, () =>
            {
                if (callback != null)
                {
                    callback();
                }
                inShowAni = false;
            });
        }
        //隐藏动画
        public void hideAni(TweenCallback callback = null)
        {
            if (inShowAni)
            {
                return;
            }
            inShowAni = true;
            TJ_UNITY_TOOL.DoTweenTool.FadeUI(_rectTransform, 0, 1);
            TJ_UNITY_TOOL.DoTweenTool.FadeUI(_rectTransform, 2, 0, () =>
            {
                if (callback != null)
                {
                    callback();
                }
                _rectTransform.gameObject.SetActive(false);
                inShowAni = false;
            });
        }
    }
}