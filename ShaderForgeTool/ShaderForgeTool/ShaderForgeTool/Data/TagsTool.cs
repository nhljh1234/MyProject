using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShaderForgeTool.Data
{
    class TagsTool
    {
        //缓存一下修改Queue之前的代码
        private string codeSave = null;

        private static string TRANSPARENT_QUEUE = "\"Queue\"=\"Transparent\"";

        //判断是不是渲染队列是不是Transparent
        public bool getQueueIsTransparent(List<string> shaderCodeList)
        {
            for (int i = 0; i < shaderCodeList.Count; i++)
            {
                if (shaderCodeList[i].Contains(TRANSPARENT_QUEUE))
                {
                    return true;
                }
            }
            return false;
        }

        public List<string> changeQueueToTransparent(bool useSpineQueueFlag, List<string> shaderCodeList)
        {
            for (int i = 0; i < shaderCodeList.Count; i++)
            {
                if (shaderCodeList[i].Contains("\"Queue\"="))
                {
                    if (useSpineQueueFlag)
                    {
                        if (codeSave == null)
                        {
                            codeSave = shaderCodeList[i];
                        }
                        shaderCodeList[i] = "            " + TRANSPARENT_QUEUE;
                    }
                    else
                    {
                        shaderCodeList[i] = codeSave == null ? 
                            "            " + TRANSPARENT_QUEUE : codeSave;
                    }
                }
            }
            return shaderCodeList;
        }
    }
}
