using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using XLua;

public class Main : MonoBehaviour {

    private LuaEnv m_LuaEnv;

	// Use this for initialization
	void Start () {
        m_LuaEnv = new LuaEnv();
        m_LuaEnv.DoString(File.ReadAllBytes("Assets/Resources/Lua/LuaScript/src/Test.lua.txt"),
            "Test.lua.txt");
    }

    // Update is called once per frame
    void Update () {
		
	}
}
