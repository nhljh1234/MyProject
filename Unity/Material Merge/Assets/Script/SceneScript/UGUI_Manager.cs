using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class UGUI_Manager : MonoBehaviour
{
    public RectTransform UIPanel;
    //放置提示界面
    public RectTransform NoticePanel;
    //放置网络加载层
    public RectTransform NetPanel;
    //测试按钮
    public RectTransform button_1;
    public RectTransform button_2;
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

        //按钮
        Button buttonComp_1 = button_1.GetComponent<Button>();
        Button buttonComp_2 = button_2.GetComponent<Button>();
        buttonComp_1.onClick.AddListener(() =>
        {
            uiManagerTool.hideUI(TJ_UNITY_TOOL.UIManagerTool.UI_PANEL_TYPE.UI, "Panel_1");
        });
        buttonComp_2.onClick.AddListener(() =>
        {
            uiManagerTool.showUI(TJ_UNITY_TOOL.UIManagerTool.UI_PANEL_TYPE.UI, "Panel_1");
        });
    }

    // Update is called once per frame
    void Update()
    {

    }
}