using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
using DG.Tweening;

namespace TJ_UNITY_TOOL
{
    public class SDKTool
    {
        private static SDKTool _SDKTool = null;
        //单例模式
        private SDKTool()
        {

        }
        //获取单例
        public static SDKTool GetInstance()
        {
            if (_SDKTool == null)
            {
                _SDKTool = new SDKTool();
                SDKInit();
            }
            return _SDKTool;
        }
        //获取网络状态
        public string getNetStatus()
        {
            string str = callPlatform(SDKAction.GET_NET_STATUS, TJ_UNITY_TOOL.JsonTool.getListJsonStr(new List<string>()));
            if (str != null)
            {
                UnityEngine.MonoBehaviour.print(str);
                Dictionary<string, string> dic = TJ_UNITY_TOOL.JsonTool.getDic<string, string>(str);
                UnityEngine.MonoBehaviour.print(dic);
                if (dic.ContainsKey("status"))
                {
                    str = dic["status"];
                }
            }
            return str;
        }
        public string callPlatformOut(int action, string data)
        {
            return callPlatform(action, data);
        }
        //调用SDK
        private static string callPlatform(int action, string data)
        {
            if (Application.platform == RuntimePlatform.Android)
            {
                AndroidJavaClass jc = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
                AndroidJavaObject jo = jc.GetStatic<AndroidJavaObject>("currentActivity");
                string returnStr = jo.Call<string>("callPlatform", action, data);
                if (returnStr != null)
                {
                    return returnStr.ToString();
                }
                return null;
            }
            else if (Application.platform == RuntimePlatform.IPhonePlayer)
            {
                return null;
            }
            return null;
        }
        //初始化SDK
        private static void SDKInit()
        {
            UnityEngine.MonoBehaviour.print("SDK init!!");
            callPlatform(SDKAction.SDK_INIT, "");
        }
    }
}