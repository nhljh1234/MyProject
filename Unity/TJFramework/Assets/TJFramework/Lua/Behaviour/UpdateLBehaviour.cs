using System;
using UnityEngine;
using XLua;

namespace TJ
{
    public class UpdateLBehaviour : LBehaviour
    {
        Action<LuaTable> cbUpdate;

        protected override void BindAction()
        {
            luaInst.Get("Update", out cbUpdate);
        }

        protected override void UnbindAction()
        {
            cbUpdate = null;
        }

        void Update()
        {
            SafeCallLua(cbUpdate, luaInst);
        }
    }
}
