Shader "Shader Forge/liuguang_1" {
    Properties {
        _MainShadowTex ("MainShadowTex", 2D) = "white" {}
        _shadowAlphaMin ("shadowAlphaMin", Float) = 0.1
        _MainTex ("MainTex", 2D) = "white" {}
        _TintColor ("Color", Color) = (0.5,0.5,0.5,1)
        _node_2684 ("node_2684", 2D) = "white" {}
        _node_6361 ("node_6361", 2D) = "white" {}
        _node_8214 ("node_8214", 2D) = "white" {}
    }
    SubShader {
        Tags {
            "IgnoreProjector"="True"
            "Queue"="Transparent"
            "RenderType"="Transparent"
            "PreviewType"="Plane"
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
            // Tags {
            //     "LightMode"="ForwardBase"
            // }
            //AlphaTest Greater 0.1
            Blend One One
            Cull Off
            ZWrite On
            ZTest LEqual
            
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #define UNITY_PASS_FORWARDBASE
            #include "UnityCG.cginc"
            #pragma multi_compile_fwdbase
            #pragma multi_compile_fog
            #pragma only_renderers d3d9 d3d11 glcore gles 
            #pragma target 3.0
            uniform float4 _TimeEditor;
            uniform sampler2D _MainTex; uniform float4 _MainTex_ST;
            uniform float4 _TintColor;
            uniform sampler2D _node_2684; uniform float4 _node_2684_ST;
            uniform sampler2D _node_6361; uniform float4 _node_6361_ST;
            uniform sampler2D _node_8214; uniform float4 _node_8214_ST;
            uniform sampler2D _MainShadowTex;
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
////// Lighting:
////// Emissive:
                float4 _node_6361_var = tex2D(_node_6361,TRANSFORM_TEX(i.uv0, _node_6361));
                float4 _node_8214_var = tex2D(_node_8214,TRANSFORM_TEX(i.uv0, _node_8214));
                float4 node_9495 = _Time + _TimeEditor;
                float2 node_6985 = (i.uv0+node_9495.g*float2(-0.05,-0.2));
                float4 _node_2684_var = tex2D(_node_2684,TRANSFORM_TEX(node_6985, _node_2684));
                float2 node_2470 = (i.uv0+node_9495.g*float2(0.05,0.2));
                float4 _MainTex_var = tex2D(_MainTex,TRANSFORM_TEX(node_2470, _MainTex));
                float3 node_2393 = ((_node_8214_var.rgb*(_node_2684_var.rgb+_MainTex_var.rgb))*i.vertexColor.rgb*_TintColor.rgb*2.0);
                float3 emissive = (_node_6361_var.rgb+(node_2393*_node_6361_var.rgb));
                float3 finalColor = emissive;
                fixed4 finalRGBA = fixed4(finalColor,1);
//                UNITY_APPLY_FOG_COLOR(i.fogCoord, finalRGBA, fixed4(0.5,0.5,0.5,1));
                return finalRGBA;
            }
            ENDCG
        }
    }
    //CustomEditor "ShaderForgeMaterialInspector"
}
