using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShaderForgeTool.Data
{
    class PassClass
    {
        private List<string> shaderCodeList = new List<string>();

        private ShadowTool shadowTool = new ShadowTool();
        private FogTool fogTool = new FogTool();
        private TagsTool tagsTool = new TagsTool();

        //初始化类
        public PassClass(string filePath)
        {
            StreamReader sr = new StreamReader(filePath, System.Text.Encoding.Default);
            //过滤掉开头的注释
            bool findShader = false;
            string lineCode;
            while ((lineCode = sr.ReadLine()) != null)
            {
                if (lineCode.Contains("Shader") && lineCode.Contains("{"))
                {
                    findShader = true;
                }
                if (!findShader)
                {
                    continue;
                }
                shaderCodeList.Add(lineCode);
            }
        }

        //返回最后的字符串
        public string getResultCodeStr()
        {
            string resultStr = "";
            for (int i = 0; i < shaderCodeList.Count; i++)
            {
                resultStr = resultStr + shaderCodeList[i] + "\r\n";
            }
            return resultStr;
        }

        //替换名字
        public void replaceFileName(string oldName, string newName)
        {
            for (int i = 0; i < shaderCodeList.Count; i++)
            {
                if (shaderCodeList[i].Contains(oldName))
                {
                    shaderCodeList[i] = shaderCodeList[i].Replace(oldName, newName);
                }
            }
        }

        //阴影相关
        public void checkShadowChange(bool showShadow)
        {
            shaderCodeList = shadowTool.checkShadowChange(showShadow, shaderCodeList);
        }
        public bool judgeHaveShadowCaster()
        {
            return shadowTool.judgeHaveShadowCaster(shaderCodeList);
        }

        //雾效相关
        public void checkFogEffectChange(bool showFog)
        {
            shaderCodeList = fogTool.checkFogChange(showFog, shaderCodeList);
        }
        public bool judgeHaveFogEffect()
        {
            return fogTool.judgeHaveFogEffect(shaderCodeList);
        }

        //渲染队列相关
        public void checkSpineQueueChange(bool useSpineQueueFlag)
        {
            shaderCodeList = tagsTool.changeQueueToTransparent(useSpineQueueFlag, shaderCodeList);
        }
        public bool judgeTransparentQueue()
        {
            return tagsTool.getQueueIsTransparent(shaderCodeList);
        }
    }
}
