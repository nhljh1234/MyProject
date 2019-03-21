using System;
using UnityEngine;
using XLua;

namespace TJ
{
    public class AllUpdateLBehaviour : LBehaviour
    {
        Action<LuaTable> cbUpdate;
        Action<LuaTable> cbFixedUpdate;
        Action<LuaTable> cbLateUpdate;

        protected override void BindAction()
        {
            luaInst.Get("Update", out cbUpdate);
            luaInst.Get("FixedUpdate", out cbFixedUpdate);
            luaInst.Get("LateUpdate", out cbLateUpdate);
        }

        protected override void UnbindAction()
        {
            cbUpdate = null;
            cbFixedUpdate = null;
            cbLateUpdate = null;
        }

        void Update()
        {
            SafeCallLua(cbUpdate, luaInst);
        }

        void FixedUpdate()
        {
            SafeCallLua(cbFixedUpdate, luaInst);
        }

        void LateUpdate()
        {
            SafeCallLua(cbLateUpdate, luaInst);
        }
    }
}
