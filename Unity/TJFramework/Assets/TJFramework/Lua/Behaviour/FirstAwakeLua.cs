using System;
using UnityEngine;
using XLua;

namespace TJ
{
    //优先执行Awake和Start方法. 尤其场景切换用于初始化
    //需要在Script Execution Order面板添加TJ.FirstAwakeLua类, 且把值设置为<0
    public class FirstAwakeLua : MonoBehaviour
    {
        [TextArea]
        public string awakeScript = "";
        [TextArea]
        public string startScript = "";

        void Awake()
        {
            if (awakeScript.Trim().Length > 0)
                LuaManager.Instance.DoString(awakeScript);
        }

        void Start()
        {
            if (awakeScript.Trim().Length > 0)
                LuaManager.Instance.DoString(startScript);
        }
    }



}
