using System;
using UnityEngine;
using XLua;

namespace TJ
{
    //Lua版的MonoBehaviour
    //为Lua可以执行MonoBehaviour提供一个通用的方案
    //通过luaInst绑定Lua对象
    //通过执行各种MonoBehaviour的消息回调, 桥接调用luaInst的同名函数
    //LBehaviour只注册了Start和OnDestroy消息, 这是基于性能考虑. 可以通过LBehaviour的继承来实现用户的消息注册
    //Lua层. 没有Awake消息, 多了OnBind消息
    public class LBehaviour : MonoBehaviour
    {
        //要绑定的lua的模块名
        //moduleName为Lua的文件名, 可以被mod = require('moduleName')正确的执行
        //如果mod是个普通table, 则绑定
        //如果mod是table, 且table有new或New的函数(不触发元方法), 则绑定mod.new()的返回值
        //如果mod是函数, 则绑定mod()的返回值
        public string moduleName = "";

        protected LuaTable luaInst;

        Action<LuaTable> cbStart;
        Action<LuaTable> cbOnDestroy;


        public void Bind(LuaTable inst)
        {
            luaInst = inst;

            luaInst.Get("Start", out cbStart);
            luaInst.Get("OnDestroy", out cbOnDestroy);
            BindAction();

            luaInst.Set("comp", this);

            Action<LuaTable> cbOnBind;
            luaInst.Get("OnBind", out cbOnBind);
            SafeCallLua(cbOnBind, luaInst);
        }

        void Clear()
        {
            UnbindAction();

            cbStart = null;
            cbOnDestroy = null;

            luaInst.Set<string, object>("comp", null);

            luaInst = null;
        }

        protected virtual void BindAction()
        {
        }

        protected virtual void UnbindAction()
        {
        }

        protected void SafeCallLua(Action<LuaTable> caller, LuaTable parm0)
        {
            if (caller != null)
            {
                try
                {
                    caller(parm0);
                }
                catch (Exception e)
                {
                    Debug.LogError(e);
                }
            }
        }


        void Awake()
        {
            if (moduleName.Trim().Length != 0)
            {
                object[] rets = LuaManager.Instance.DoString(string.Format("return require('{0}')", moduleName.Trim()));
                if (rets.Length >= 1)
                {
                    LuaTable tluaInst = null;
                    if (rets[0] is LuaTable)
                    {
                        LuaTable cls = rets[0] as LuaTable;
                        Func<LuaTable> funcNew;
                        cls.RawGet("new", out funcNew);
                        if (funcNew == null)
                            cls.RawGet("New", out funcNew);
                        if (funcNew != null)
                            tluaInst = funcNew();
                        else
                            tluaInst = cls;
                    }
                    else if (rets[0] is LuaFunction)
                    {
                        LuaFunction func = rets[0] as LuaFunction;
                        tluaInst = func.Func<LuaTable>();
                    }

                    if (tluaInst != null)
                    {
                        Bind(tluaInst);
                    }
                }
            }
        }

        void Start()
        {
            SafeCallLua(cbStart, luaInst);
        }

        void OnDestroy()
        {
            SafeCallLua(cbOnDestroy, luaInst);
            Clear();
        }
    }
}
