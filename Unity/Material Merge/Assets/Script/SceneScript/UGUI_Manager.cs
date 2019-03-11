using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UGUI_Manager : MonoBehaviour
{
    public RectTransform UIPanel;
    //放置提示界面
    public RectTransform NoticePanel;
    //放置网络加载层
    public RectTransform NetPanel;
    private TJ_UNITY_TOOL.UIManagerTool uiManagerTool;
    // Use this for initialization
    void Start()
    {
        uiManagerTool = TJ_UNITY_TOOL.UIManagerTool.GetInstance();
        uiManagerTool.setPanel(UIPanel, NoticePanel, NetPanel);
        uiManagerTool.addUIToPanel("UI/Panel_1", TJ_UNITY_TOOL.UIManagerTool.UI_PANEL_TYPE.UI, "Panel_1", false, false);
		uiManagerTool.addUIToPanel("UI/Panel_2", TJ_UNITY_TOOL.UIManagerTool.UI_PANEL_TYPE.UI, "Panel_2", false, false);
        uiManagerTool.addUIToPanel("UI/Panel_3", TJ_UNITY_TOOL.UIManagerTool.UI_PANEL_TYPE.UI, "Panel_3", false, false);
		uiManagerTool.addUIToPanel("UI/Panel_2", TJ_UNITY_TOOL.UIManagerTool.UI_PANEL_TYPE.UI, "Panel_2", false, false);
    }

    // Update is called once per frame
    void Update()
    {

    }
}
