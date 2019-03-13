using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace TJ_UNITY_TOOL
{
    //单例模式
    public class UIManagerTool : MonoBehaviour
    {
        public enum UI_PANEL_TYPE
        {
            UI = 1,
            NOTICE = 2,
            NET = 3,
        }
        private static UIManagerTool _uiManager = null;
        //分为三个层级
        //放置UI
        private RectTransform UIPanel;
        //放置提示界面
        private RectTransform NoticePanel;
        //放置网络加载层
        private RectTransform NetPanel;
        public UIManagerTool()
        {

        }
        public static UIManagerTool GetInstance()
        {
            if (_uiManager == null)
            {
                _uiManager = new UIManagerTool();
            }
            return _uiManager;
        }
        //增加一个页面在指定的层级
        /**
         * prefabPath：预制体路径
         * type：加入的层级
         * uiName：ui的名字
         * moreFlag：是否能增加多次
         * hideAll：其他界面全部隐藏
         */
        public void addUIToPanel(string prefabPath, UI_PANEL_TYPE type, string uiName, bool moreFlag, bool hideAll)
        {
            //加载界面
            Object prefab = Resources.Load(prefabPath, typeof(GameObject));
            if (prefab == null)
            {
                return;
            }
            if (hideAll)
            {
                hideAllUIInPanel(type);
            }
            RectTransform panel = getPanelByType(type);
            RectTransform childUI = getChildUI(type, uiName);
            if (childUI != null && !moreFlag)
            {
                childUI.gameObject.SetActive(true);
                //设定顺序
                childUI.SetAsLastSibling();
                return;
            }
            //判断加载方式，存在的直接复制
            GameObject ui;
            if (childUI == null)
            {
                ui = GameObject.Instantiate(prefab) as GameObject;
            }
            else
            {
                ui = GameObject.Instantiate(childUI.gameObject);
            }
            //获取存储的结点信息
            Vector2 offsetMinSave = ui.GetComponent<RectTransform>().offsetMin;
            Vector2 offsetMaxSave = ui.GetComponent<RectTransform>().offsetMax;
            ui.name = uiName;
            ui.SetActive(true);
            ui.transform.SetParent(panel);
            //恢复四个锚点，克隆的有点问题
            childUI = ui.GetComponent<RectTransform>();
            childUI.offsetMin = offsetMinSave;
            childUI.offsetMax = offsetMaxSave;
            //设定顺序
            ui.transform.SetAsLastSibling();
        }
        //获取指定层级
        public RectTransform getPanelByType(UI_PANEL_TYPE type)
        {
            switch (type)
            {
                case UI_PANEL_TYPE.UI:
                    return UIPanel;
                case UI_PANEL_TYPE.NOTICE:
                    return NoticePanel;
                case UI_PANEL_TYPE.NET:
                    return NetPanel;
            }
            return null;
        }
        //判断一个层级有没有指定名字的UI
        public bool judgeHaveUIByName(UI_PANEL_TYPE type, string uiName)
        {
            return getChildUI(type, uiName) != null;
        }
        public RectTransform getChildUI(UI_PANEL_TYPE type, string uiName)
        {
            RectTransform panel = getPanelByType(type);
            if (panel == null)
            {
                return null;
            }
            Transform child = panel.Find(uiName);
            if (child == null)
            {
                return null;
            }
            return child.GetComponent<RectTransform>();
        }
        //所有的界面全部隐藏
        public void hideAllUIInPanel(UI_PANEL_TYPE type)
        {
            RectTransform panel = getPanelByType(type);
            for (int i = 0; i < panel.childCount; i++)
            {
                panel.GetChild(i).gameObject.SetActive(false);
            }
        }
        //设置层级
        public void setPanel(RectTransform uiPanel, RectTransform noticePanel, RectTransform netPanel)
        {
            UIPanel = uiPanel;
            NoticePanel = noticePanel;
            NetPanel = netPanel;
        }
    }
}