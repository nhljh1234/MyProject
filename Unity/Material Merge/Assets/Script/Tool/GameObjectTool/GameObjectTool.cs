using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace TJ_UNITY_TOOL
{
    public class GameObjectTool
    {
        public static Transform findChild (Transform trans, string findChildName)
        {
            Transform child = trans.Find(findChildName);
            if (child != null)
            {
                return child;
            }
            for (int i = 0; i < trans.childCount; i++)
            {
                child = findChild(trans.GetChild(i), findChildName);
                if (child != null)
                {
                    return child;
                }
            }
            return null;
        }
    }
}
