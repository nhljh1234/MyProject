using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

namespace TJ_UNITY_TOOL
{
    public class SceneRatioTool
    {
        //刘海高度
        private const int SCENE_HEAD_NUM = 60;
        private const int SCENE_BACK_NUM = 60;

        public enum SCENE_MODE
        {
            landscape = 1, //横屏
            portrait = 2, //竖屏
        }

        //获取是否是刘海屏幕
        public static bool getIsIPhoneX()
        {
            if (Screen.width > Screen.height)
            {
                return ((float)Screen.width / Screen.height) > 2.0f;
            }
            else
            {
                return ((float)Screen.height / Screen.width) > 2.0f;
            }
        }

        //获取横屏还是竖屏
        public static SCENE_MODE getSceneMode()
        {
            if (Screen.width > Screen.height)
            {
                return SCENE_MODE.landscape;
            }
            return SCENE_MODE.portrait;
        }

        //获取刘海距离
        public static Vector2 getSceneMarginNum()
        {
            return new Vector2(SCENE_HEAD_NUM, SCENE_BACK_NUM);
        }
    }
}