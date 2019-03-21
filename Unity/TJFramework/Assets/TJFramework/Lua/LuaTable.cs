#if USE_UNI_LUA
using LuaAPI = UniLua.Lua;
using RealStatePtr = UniLua.ILuaState;
using LuaCSFunction = UniLua.CSharpFunctionDelegate;
#else
using LuaAPI = XLua.LuaDLL.Lua;
using RealStatePtr = System.IntPtr;
using LuaCSFunction = XLua.LuaDLL.lua_CSFunction;
#endif

using System;
using System.Collections.Generic;
using System.Text;
using System.Collections;

namespace XLua
{
    public partial class LuaTable : LuaBase
    {
        // no boxing version get
        public void RawGet<TKey, TValue>(TKey key, out TValue value)
        {
#if THREAD_SAFE || HOTFIX_ENABLE
            lock (luaEnv.luaEnvLock)
            {
#endif
                var L = luaEnv.L;
                var translator = luaEnv.translator;
                int oldTop = LuaAPI.lua_gettop(L);
                LuaAPI.lua_getref(L, luaReference);
                translator.PushByType(L, key);

                LuaAPI.lua_rawget(L, -2);
                
                LuaTypes lua_type = LuaAPI.lua_type(L, -1);
                Type type_of_value = typeof(TValue);
                if (lua_type == LuaTypes.LUA_TNIL && type_of_value.IsValueType())
                {
                    throw new InvalidCastException("can not assign nil to " + type_of_value.GetFriendlyName());
                }

                try
                {
                    translator.Get(L, -1, out value);
                }
                catch (Exception e)
                {
                    throw e;
                }
                finally
                {
                    LuaAPI.lua_settop(L, oldTop);
                }
#if THREAD_SAFE || HOTFIX_ENABLE
            }
#endif
        }

        // no boxing version get
        public bool ContainsRawKey<TKey>(TKey key)
        {
#if THREAD_SAFE || HOTFIX_ENABLE
            lock (luaEnv.luaEnvLock)
            {
#endif
                var L = luaEnv.L;
                var translator = luaEnv.translator;
                int oldTop = LuaAPI.lua_gettop(L);
                LuaAPI.lua_getref(L, luaReference);
                translator.PushByType(L, key);

                LuaAPI.lua_rawget(L, -2);

                bool ret =  LuaAPI.lua_type(L, -1) != LuaTypes.LUA_TNIL;

                LuaAPI.lua_settop(L, oldTop);

                return ret;

#if THREAD_SAFE || HOTFIX_ENABLE
            }
#endif
        }

    }
}
