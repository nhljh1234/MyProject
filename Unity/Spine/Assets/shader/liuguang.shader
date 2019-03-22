// Shader created with Shader Forge v1.37 
// Shader Forge (c) Neat Corporation / Joachim Holmer - http://www.acegikmo.com/shaderforge/
// Note: Manually altering this data may prevent you from opening it in Shader Forge
/*SF_DATA;ver:1.37;sub:START;pass:START;ps:flbk:,iptp:0,cusa:False,bamd:0,cgin:,lico:1,lgpr:1,limd:0,spmd:1,trmd:0,grmd:0,uamb:True,mssp:True,bkdf:False,hqlp:False,rprd:False,enco:False,rmgx:True,imps:True,rpth:0,vtps:0,hqsc:True,nrmq:1,nrsp:2,vomd:0,spxs:False,tesm:0,olmd:1,culm:2,bsrc:0,bdst:0,dpts:2,wrdp:False,dith:0,atcv:False,rfrpo:True,rfrpn:Refraction,coma:15,ufog:True,aust:True,igpj:True,qofs:0,qpre:3,rntp:2,fgom:False,fgoc:True,fgod:False,fgor:False,fgmd:0,fgcr:0.5,fgcg:0.5,fgcb:0.5,fgca:1,fgde:0.01,fgrn:0,fgrf:300,stcl:False,stva:128,stmr:255,stmw:255,stcp:6,stps:0,stfa:0,stfz:0,ofsf:0,ofsu:0,f2p0:False,fnsp:True,fnfb:True,fsmp:False;n:type:ShaderForge.SFN_Final,id:4795,x:33303,y:32695,varname:node_4795,prsc:2|emission-5236-OUT;n:type:ShaderForge.SFN_Tex2d,id:6074,x:31890,y:32570,ptovrint:False,ptlb:MainTex,ptin:_MainTex,varname:_MainTex,prsc:2,glob:False,taghide:False,taghdr:False,tagprd:False,tagnsco:False,tagnrm:False,tex:883193c009379a0448166ae3e7a954c7,ntxv:0,isnm:False|UVIN-2470-UVOUT;n:type:ShaderForge.SFN_Multiply,id:2393,x:32474,y:32793,varname:node_2393,prsc:2|A-7243-OUT,B-2053-RGB,C-797-RGB,D-9248-OUT;n:type:ShaderForge.SFN_VertexColor,id:2053,x:32235,y:32772,varname:node_2053,prsc:2;n:type:ShaderForge.SFN_Color,id:797,x:32235,y:32930,ptovrint:True,ptlb:Color,ptin:_TintColor,varname:_TintColor,prsc:2,glob:False,taghide:False,taghdr:False,tagprd:False,tagnsco:False,tagnrm:False,c1:0.5,c2:0.5,c3:0.5,c4:1;n:type:ShaderForge.SFN_Vector1,id:9248,x:32235,y:33081,varname:node_9248,prsc:2,v1:2;n:type:ShaderForge.SFN_Panner,id:2470,x:31651,y:32570,varname:node_2470,prsc:2,spu:0.05,spv:0.2|UVIN-2962-UVOUT;n:type:ShaderForge.SFN_TexCoord,id:2962,x:31414,y:32570,varname:node_2962,prsc:2,uv:0,uaff:False;n:type:ShaderForge.SFN_Tex2d,id:2684,x:31890,y:32371,ptovrint:False,ptlb:node_2684,ptin:_node_2684,varname:node_2684,prsc:2,glob:False,taghide:False,taghdr:False,tagprd:False,tagnsco:False,tagnrm:False,tex:d634e070d45e3814da71a6ca45b09524,ntxv:0,isnm:False|UVIN-6985-UVOUT;n:type:ShaderForge.SFN_Panner,id:6985,x:31651,y:32371,varname:node_6985,prsc:2,spu:-0.05,spv:-0.2|UVIN-2962-UVOUT;n:type:ShaderForge.SFN_Add,id:1726,x:32053,y:32570,varname:node_1726,prsc:2|A-2684-RGB,B-6074-RGB;n:type:ShaderForge.SFN_Tex2d,id:6361,x:32790,y:32522,ptovrint:False,ptlb:node_6361,ptin:_node_6361,varname:node_6361,prsc:2,glob:False,taghide:False,taghdr:False,tagprd:False,tagnsco:False,tagnrm:False,tex:c60c9d978bdfad04c9a52f0b57b36305,ntxv:0,isnm:False;n:type:ShaderForge.SFN_Multiply,id:7243,x:32474,y:32562,varname:node_7243,prsc:2|A-8214-RGB,B-1726-OUT;n:type:ShaderForge.SFN_Tex2d,id:8214,x:32340,y:32356,ptovrint:False,ptlb:node_8214,ptin:_node_8214,varname:node_8214,prsc:2,glob:False,taghide:False,taghdr:False,tagprd:False,tagnsco:False,tagnrm:False,tex:3de43f70b0103554cbf97e611d8f797c,ntxv:0,isnm:False;n:type:ShaderForge.SFN_Multiply,id:7717,x:32717,y:32793,varname:node_7717,prsc:2|A-2393-OUT,B-6361-RGB;n:type:ShaderForge.SFN_Add,id:5236,x:32949,y:32779,varname:node_5236,prsc:2|A-6361-RGB,B-7717-OUT;proporder:6074-797-2684-6361-8214;pass:END;sub:END;*/

Shader "Shader Forge/liuguang" {
    Properties {
        _MainTex ("MainTex", 2D) = "white" {}
        _TintColor ("Color", Color) = (0.5,0.5,0.5,1)
        _node_2684 ("node_2684", 2D) = "white" {}
        _node_6361 ("node_6361", 2D) = "white" {}
        _node_8214 ("node_8214", 2D) = "white" {}
    }
    SubShader {
        Tags {
            "IgnoreProjector"="True"
            "Queue"="AlphaTest"
            "RenderType"="Transparent"
            "PreviewType"="Plane"
        }
        Pass {
            Name "FORWARD"
            // Tags {
            //     "LightMode"="ForwardBase"
            // }
            Blend One One
            Cull Off
            ZWrite Off
            
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
            struct VertexInput {
                float4 vertex : POSITION;
                float2 texcoord0 : TEXCOORD0;
                float4 vertexColor : COLOR;
            };
            struct VertexOutput {
                float4 pos : SV_POSITION;
                float2 uv0 : TEXCOORD0;
                float4 vertexColor : COLOR;
                UNITY_FOG_COORDS(1)
            };
            VertexOutput vert (VertexInput v) {
                VertexOutput o = (VertexOutput)0;
                o.uv0 = v.texcoord0;
                o.vertexColor = v.vertexColor;
                o.pos = UnityObjectToClipPos( v.vertex );
                UNITY_TRANSFER_FOG(o,o.pos);
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
                UNITY_APPLY_FOG_COLOR(i.fogCoord, finalRGBA, fixed4(0.5,0.5,0.5,1));
                return finalRGBA;
            }
            ENDCG
        }
    }
    //CustomEditor "ShaderForgeMaterialInspector"
}
