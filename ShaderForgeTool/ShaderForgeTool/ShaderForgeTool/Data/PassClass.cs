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

        //增加阴影相关的代码
        public void addShadowCaster()
        {
            if (judgeHaveShadowCaster())
            {
                //存在的话就不要增加了
                return;
            }
            List<string> shaderCodeListNew = new List<string>();
            for (int i = 0; i < shaderCodeList.Count; i++)
            {
                if (shaderCodeList[i].Contains("Pass") && shaderCodeList[i].Contains("{"))
                {
                    //第一个pass
                    shaderCodeListNew.Add("        Pass {");
                    shaderCodeListNew.Add("            Name \"ShadowCaster\"");
                    shaderCodeListNew.Add("            Tags {\"LightMode\" = \"ShadowCaster\"}");
                    shaderCodeListNew.Add("            ZWrite On");
                    shaderCodeListNew.Add("			   ZTest LEqual");
                    shaderCodeListNew.Add("            CGPROGRAM");
                    shaderCodeListNew.Add("            #pragma vertex vert");
                    shaderCodeListNew.Add("            #pragma fragment frag");
                    shaderCodeListNew.Add("            #pragma multi_compile_shadowcaster");
                    shaderCodeListNew.Add("            #include \"UnityCG.cginc\"");
                    shaderCodeListNew.Add("            uniform sampler2D _MainShadowTex; ");
                    shaderCodeListNew.Add("            struct v2f");
                    shaderCodeListNew.Add("            {");
                    shaderCodeListNew.Add("                V2F_SHADOW_CASTER;");
                    shaderCodeListNew.Add("                float2 uv : TEXCOORD1;");
                    shaderCodeListNew.Add("            }; ");
                    shaderCodeListNew.Add("            v2f vert(appdata_base  v)");
                    shaderCodeListNew.Add("            {");
                    shaderCodeListNew.Add("                v2f o;");
                    shaderCodeListNew.Add("                TRANSFER_SHADOW_CASTER(o);");
                    shaderCodeListNew.Add("                o.uv = v.texcoord;");
                    shaderCodeListNew.Add("                return o;");
                    shaderCodeListNew.Add("            }");
                    shaderCodeListNew.Add("            float4 frag(v2f i) : Color");
                    shaderCodeListNew.Add("            {");
                    shaderCodeListNew.Add("                fixed4 texcol = tex2D(_MainShadowTex, i.uv);");
                    shaderCodeListNew.Add("                if (texcol.a < 0.15) {");
                    shaderCodeListNew.Add("                    discard;");
                    shaderCodeListNew.Add("                }");
                    shaderCodeListNew.Add("                SHADOW_CASTER_FRAGMENT(i);");
                    shaderCodeListNew.Add("            }");
                    shaderCodeListNew.Add("            ENDCG");
                    shaderCodeListNew.Add("        }");
                }
                shaderCodeListNew.Add(shaderCodeList[i]);
            }
            shaderCodeList = shaderCodeListNew;
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

        /**
         * 判断是不是阴影Pass
         * 1.Name ShadowCaster
         * tagList 存在 {"LightMode" = "ShadowCaster"}
         **/
        public bool judgeHaveShadowCaster()
        {
            return judgeHaveShadowCasterName() && judgeHaveShadowCasterTag();
        }


        private bool judgeHaveShadowCasterName()
        {
            foreach (string lineCode in shaderCodeList)
            {
                if (lineCode.Contains("Name") && lineCode.Contains("ShadowCaster"))
                {
                    return true;
                }
            }
            return false;
        }

        private bool judgeHaveShadowCasterTag()
        {
            foreach (string lineCode in shaderCodeList)
            {
                if (lineCode.Contains("LightMode") && lineCode.Contains("=") && lineCode.Contains("ShadowCaster"))
                {
                    return true;
                }
            }
            return false;
        }
    }
}
