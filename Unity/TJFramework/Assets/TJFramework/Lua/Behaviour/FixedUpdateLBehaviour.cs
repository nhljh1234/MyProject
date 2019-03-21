using System;
using UnityEngine;
using XLua;

namespace TJ
{
    public class FixedUpdateLBehaviour : LBehaviour
    {
        Action<LuaTable> cbFixedUpdate;

        protected override void BindAction()
        {
            luaInst.Get("FixedUpdate", out cbFixedUpdate);
        }

        protected override void UnbindAction()
        {
            cbFixedUpdate = null;
        }

        void FixedUpdate()
        {
            SafeCallLua(cbFixedUpdate, luaInst);
        }
    }
}
