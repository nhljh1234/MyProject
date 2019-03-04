using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShaderForgeTool.Data
{
    class ShadowTool
    {
        /**
         * 判断是不是阴影Pass
         * 1.Name ShadowCaster
         * tagList 存在 {"LightMode" = "ShadowCaster"}
         **/
        public bool judgeHaveShadowCaster(List<string> shaderCodeList)
        {
            return judgeHaveShadowCasterName(shaderCodeList) && 
                judgeHaveShadowCasterTag(shaderCodeList);
        }

        public List<string> checkShadowChange(bool showShadow, List<string> shaderCodeList)
        {
            if (showShadow)
            {
                return addShadowCaster(shaderCodeList);
            }
            else
            {
                return removeShadowCaster(shaderCodeList);
            }
        }

        //移除阴影相关的代码
        private List<string> removeShadowCaster(List<string> shaderCodeList)
        {
            if (!judgeHaveShadowCaster(shaderCodeList))
            {
                //存在的话就不要增加了
                return null;
            }
            bool findShadowPass = false;
            List<string> shaderCodeListNew = new List<string>();
            for (int i = 0; i < shaderCodeList.Count; i++)
            {
                //判断下下一句是不是Tags {"LightMode" = "ShadowCaster"}
                if ((i + 2) < shaderCodeList.Count &&
                    shaderCodeList[i + 2].Contains("LightMode") && shaderCodeList[i + 2].Contains("=") &&
                    shaderCodeList[i + 2].Contains("ShadowCaster"))
                {
                    findShadowPass = true;
                    continue;
                }
                if (shaderCodeList[i].Contains("Pass") && shaderCodeList[i].Contains("{"))
                {
                    findShadowPass = false;
                }
                if (findShadowPass)
                {
                    continue;
                }
                if (shaderCodeList[i].Contains("_MainShadowTex") || 
                    shaderCodeList[i].Contains("_shadowAlphaMin"))
                {
                    continue;
                }
                shaderCodeListNew.Add(shaderCodeList[i]);
            }
            return shaderCodeListNew;
        }

        //增加阴影相关的代码
        private List<string> addShadowCaster(List<string> shaderCodeList)
        {
            if (judgeHaveShadowCaster(shaderCodeList))
            {
                //存在的话就不要增加了
                return null;
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
                    shaderCodeListNew.Add("            ZTest LEqual");
                    shaderCodeListNew.Add("            CGPROGRAM");
                    shaderCodeListNew.Add("            #pragma vertex vert");
                    shaderCodeListNew.Add("            #pragma fragment frag");
                    shaderCodeListNew.Add("            #pragma multi_compile_shadowcaster");
                    shaderCodeListNew.Add("            #include \"UnityCG.cginc\"");
                    shaderCodeListNew.Add("            uniform sampler2D _MainShadowTex; ");
                    shaderCodeListNew.Add("            uniform float _shadowAlphaMin; ");
                    shaderCodeListNew.Add("            struct v2f {");
                    shaderCodeListNew.Add("                V2F_SHADOW_CASTER;");
                    shaderCodeListNew.Add("                float2 uv : TEXCOORD1;");
                    shaderCodeListNew.Add("            }; ");
                    shaderCodeListNew.Add("            v2f vert(appdata_base  v) {");;
                    shaderCodeListNew.Add("                v2f o;");
                    shaderCodeListNew.Add("                TRANSFER_SHADOW_CASTER(o);");
                    shaderCodeListNew.Add("                o.uv = v.texcoord;");
                    shaderCodeListNew.Add("                return o;");
                    shaderCodeListNew.Add("            }");
                    shaderCodeListNew.Add("            float4 frag(v2f i) : Color {");
                    shaderCodeListNew.Add("                fixed4 texcol = tex2D(_MainShadowTex, i.uv);");
                    shaderCodeListNew.Add("                if (texcol.a < _shadowAlphaMin) {");
                    shaderCodeListNew.Add("                    discard;");
                    shaderCodeListNew.Add("                }");
                    shaderCodeListNew.Add("                SHADOW_CASTER_FRAGMENT(i);");
                    shaderCodeListNew.Add("            }");
                    shaderCodeListNew.Add("            ENDCG");
                    shaderCodeListNew.Add("        }");
                }
                shaderCodeListNew.Add(shaderCodeList[i]);
                //加入变量声明相关
                if (shaderCodeList[i].Contains("Properties") && shaderCodeList[i].Contains("{"))
                {
                    shaderCodeListNew.Add("        _MainShadowTex (\"MainShadowTex\", 2D) = \"white\" {}");
                    shaderCodeListNew.Add("        _shadowAlphaMin (\"shadowAlphaMin\", Float) = 0.1");
                }
            }
            return shaderCodeListNew;
        }

        private bool judgeHaveShadowCasterName(List<string> shaderCodeList)
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

        private bool judgeHaveShadowCasterTag(List<string> shaderCodeList)
        {
            foreach (string lineCode in shaderCodeList)
            {
                if (lineCode.Contains("LightMode") && lineCode.Contains("=") &&
                    lineCode.Contains("ShadowCaster"))
                {
                    return true;
                }
            }
            return false;
        }
    }
}
