using System;
using UnityEngine;
using XLua;

namespace TJ
{
    public class LateUpdateLBehaviour : LBehaviour
    {
        Action<LuaTable> cbLateUpdate;

        protected override void BindAction()
        {
            luaInst.Get("LateUpdate", out cbLateUpdate);
        }

        protected override void UnbindAction()
        {
            cbLateUpdate = null;
        }

        void LateUpdate()
        {
            SafeCallLua(cbLateUpdate, luaInst);
        }
    }
}