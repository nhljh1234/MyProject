using System;
using UnityEngine;
using XLua;

namespace TJ
{
    public class OnEnableLBehaviour : LBehaviour
    {
        Action<LuaTable> cbOnDisable;
        Action<LuaTable> cbOnEnable;

        protected override void BindAction()
        {
            luaInst.Get("OnDisable", out cbOnDisable);
            luaInst.Get("OnEnable", out cbOnEnable);
        }

        protected override void UnbindAction()
        {
            cbOnDisable = null;
            cbOnEnable = null;
        }


        void OnDisable()
        {
            SafeCallLua(cbOnDisable, luaInst);
        }

        void OnEnable()
        {
            SafeCallLua(cbOnEnable, luaInst);
        }
    }
}
