Shader "Shader Forge/liuguang_1" {
    Properties {
        _MainShadowTex ("MainShadowTex", 2D) = "white" {}
        _shadowAlphaMin ("shadowAlphaMin", Float) = 0.1
        _MainTex ("MainTex", 2D) = "bump" {}
        _TintColor ("Color", Color) = (1,1,1,1)
        _node_2684 ("node_2684", 2D) = "white" {}
        _node_6361 ("node_6361", 2D) = "white" {}
        _node_8214 ("node_8214", 2D) = "white" {}
        _power ("power", Range(0.1, 5)) = 0.8589759
        _node_2866 ("node_2866", Range(0.9, 10)) = 1
        _node_6869 ("node_6869", Float ) = 2
        [HideInInspector]_Cutoff ("Alpha cutoff", Range(0,1)) = 0.5
    }
    SubShader {
        Tags {
            "Queue"="Transparent"
            "RenderType"="TransparentCutout"
        }
        Pass {
            Name "ShadowCaster"
            Tags {"LightMode" = "ShadowCaster"}
            ZWrite On
            ZTest LEqual
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile_shadowcaster
            #include "UnityCG.cginc"
            uniform sampler2D _MainShadowTex; 
            uniform float _shadowAlphaMin; 
            struct v2f {
                V2F_SHADOW_CASTER;
                float2 uv : TEXCOORD1;
            }; 
            v2f vert(appdata_base  v) {
                v2f o;
                TRANSFER_SHADOW_CASTER(o);
                o.uv = v.texcoord;
                return o;
            }
            float4 frag(v2f i) : Color {
                fixed4 texcol = tex2D(_MainShadowTex, i.uv);
                if (texcol.a < _shadowAlphaMin) {
                    discard;
                }
                SHADOW_CASTER_FRAGMENT(i);
            }
            ENDCG
        }
        Pass {
            Name "FORWARD"
            Tags {
                "LightMode"="ForwardBase"
            }
            Blend One One
            Cull Off
            
            
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #define UNITY_PASS_FORWARDBASE
            #include "UnityCG.cginc"
            #pragma multi_compile_fwdbase_fullshadows
            #pragma multi_compile_fog
            #pragma only_renderers d3d9 d3d11 glcore gles 
            #pragma target 3.0
            uniform float4 _TimeEditor;
            uniform sampler2D _MainTex; uniform float4 _MainTex_ST;
            uniform float4 _TintColor;
            uniform sampler2D _node_2684; uniform float4 _node_2684_ST;
            uniform sampler2D _node_6361; uniform float4 _node_6361_ST;
            uniform sampler2D _node_8214; uniform float4 _node_8214_ST;
            uniform float _power;
            uniform float _node_2866;
            uniform float _node_6869;
            struct VertexInput {
                float4 vertex : POSITION;
                float2 texcoord0 : TEXCOORD0;
                float4 vertexColor : COLOR;
            };
            struct VertexOutput {
                float4 pos : SV_POSITION;
                float2 uv0 : TEXCOORD0;
                float4 vertexColor : COLOR;
//                UNITY_FOG_COORDS(1)
            };
            VertexOutput vert (VertexInput v) {
                VertexOutput o = (VertexOutput)0;
                o.uv0 = v.texcoord0;
                o.vertexColor = v.vertexColor;
                o.pos = UnityObjectToClipPos( v.vertex );
//                UNITY_TRANSFER_FOG(o,o.pos);
                return o;
            }
            float4 frag(VertexOutput i, float facing : VFACE) : COLOR {
                float isFrontFace = ( facing >= 0 ? 1 : 0 );
                float faceSign = ( facing >= 0 ? 1 : -1 );
                clip(i.vertexColor.a - 0.5);
////// Lighting:
////// Emissive:
                float4 _node_8214_var = tex2D(_node_8214,TRANSFORM_TEX(i.uv0, _node_8214));
                float4 node_508 = _Time + _TimeEditor;
                float2 node_6985 = (i.uv0+node_508.g*float2(0,-0.2));
                float4 _node_2684_var = tex2D(_node_2684,TRANSFORM_TEX(node_6985, _node_2684));
                float2 node_2470 = (i.uv0+node_508.g*float2(0,-0.1));
                float4 _MainTex_var = tex2D(_MainTex,TRANSFORM_TEX(node_2470, _MainTex));
                float4 _node_6361_var = tex2D(_node_6361,TRANSFORM_TEX(i.uv0, _node_6361));
                float3 emissive = pow((((pow((_node_8214_var.a*_node_2684_var.rgb*(_node_2684_var.rgb+_MainTex_var.rgb)),_power)*i.vertexColor.rgb*_TintColor.rgb*_node_6869)*_node_6361_var.rgb)+(_node_6361_var.rgb*0.5)),_node_2866);
                float3 finalColor = emissive;
                fixed4 finalRGBA = fixed4(finalColor,1);
//                UNITY_APPLY_FOG_COLOR(i.fogCoord, finalRGBA, fixed4(0.5,0.5,0.5,1));
                return finalRGBA;
            }
            ENDCG
        }
    }
    CustomEditor "ShaderForgeMaterialInspector"
}
