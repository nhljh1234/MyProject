using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class AndroidTest : MonoBehaviour
{
    public Button button_1;
    public Button button_2;
    public Text text;
    // Use this for initialization
    void Start()
    {
        button_1.onClick.AddListener(() =>
        {
            text.text = TJ_UNITY_TOOL.SDKTool.GetInstance().getNetStatus();
        });

        button_2.onClick.AddListener(() =>
        {
            Dictionary<string, string> dic = new Dictionary<string, string>();
            dic.Add("_cb", "showMsg");
            TJ_UNITY_TOOL.SDKTool.GetInstance().callPlatformOut(TJ_UNITY_TOOL.SDKAction.GET_NET_STATUS_TEST, 
                TJ_UNITY_TOOL.JsonTool.getDicJsonStr(dic));
        });
    }

    public void showMsg(string str)
    {
        text.text = "showMsg: " + str;
    }
}
