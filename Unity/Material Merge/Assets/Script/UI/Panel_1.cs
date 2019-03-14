using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

namespace TJ_UNITY_TOOL
{
    //通过的UI界面逻辑
    public class Panel_1 : TJ_UNITY_TOOL.ScenePanelComponent
    {
        public override void onShow()
        {
            print("show");
            base.onShow();
            base.showAni();
        }
        public override void onHide()
        {
            print("hide");
            base.onHide();
            base.hideAni();
        }
    }
} 