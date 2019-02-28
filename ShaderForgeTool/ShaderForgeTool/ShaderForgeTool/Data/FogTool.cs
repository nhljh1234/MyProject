using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShaderForgeTool.Data
{
    class FogTool
    {
        private string[] FOG_STRING_ARRAY = new string[3] {
                "UNITY_FOG_COORDS",
                "UNITY_TRANSFER_FOG",
                "UNITY_APPLY_FOG_COLOR"
        };

        public bool judgeHaveFogEffect(List<string> shaderCodeList)
        {
            for (int i = 0; i < shaderCodeList.Count; i++)
            {
                for (int j = 0; j < FOG_STRING_ARRAY.Length; j++)
                {
                    if (shaderCodeList[i].Contains(FOG_STRING_ARRAY[j]) &&
                        !shaderCodeList[i].Contains("//"))
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public List<string> checkFogChange(bool showFog, List<string> shaderCodeList)
        {
            if (showFog)
            {
                return addFogEffect(shaderCodeList);
            }
            else
            {
                return removeFogEffect(shaderCodeList);
            }
        }

        private List<string> addFogEffect(List<string> shaderCodeList)
        {
            for (int i = 0; i < shaderCodeList.Count; i++)
            {
                for (int j = 0; j < FOG_STRING_ARRAY.Length; j++)
                {
                    if (shaderCodeList[i].Contains(FOG_STRING_ARRAY[j]) &&
                        shaderCodeList[i].Contains("//"))
                    {
                        shaderCodeList[i] = shaderCodeList[i].Replace("//", "");
                    }
                }
            }
            return shaderCodeList;
        }

        private List<string> removeFogEffect(List<string> shaderCodeList)
        {
            for (int i = 0; i < shaderCodeList.Count; i++)
            {
                for (int j = 0; j < FOG_STRING_ARRAY.Length; j++)
                {
                    if (shaderCodeList[i].Contains(FOG_STRING_ARRAY[j]) &&
                        !shaderCodeList[i].Contains("//"))
                    {
                        shaderCodeList[i] = "//" + shaderCodeList[i];
                    }
                }
            }
            return shaderCodeList;
        }
    }
}
