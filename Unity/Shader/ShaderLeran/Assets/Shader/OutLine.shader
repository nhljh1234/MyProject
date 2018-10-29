//描边效果
Shader "MyShader/OutLine"
{
	Properties
	{
		_MainTex ("Texture", 2D) = "white" {}
		_OutLineColor ("OutLineColor", Color) = (1, 0, 0, 1)
		_Scale ("RIM_SCALE", range(0, 0.02)) = 0.005
	}
	SubShader
	{
		Tags { "RenderType"="Opaque" }
		LOD 100

		Pass
		{

			Stencil
            {
                Ref 1
                Comp Always
				Pass Replace
                ZFail Keep
            }

			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			
			#include "UnityCG.cginc"

			struct appdata
			{
				float4 vertex : POSITION;
				float2 uv : TEXCOORD0;
			};

			struct v2f
			{
				float2 uv : TEXCOORD0;
				float4 vertex : SV_POSITION;
			};

			sampler2D _MainTex;
			float4 _MainTex_ST;
			fixed4 _OutLineColor;
			float _Scale;
			
			v2f vert (appdata v)
			{
				v2f o;
				o.vertex = UnityObjectToClipPos(v.vertex);
				o.uv = TRANSFORM_TEX(v.uv, _MainTex);
				return o;
			}
			
			fixed4 frag (v2f i) : SV_Target
			{
				// sample the texture
				return tex2D(_MainTex, i.uv);
			}
			ENDCG
		}

		Pass
		{
			//Cull Front

			//ZWrite Off
			
            Stencil
            {
                Ref 1
                Comp NotEqual
            }

			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			
			#include "UnityCG.cginc"

			struct appdata
			{
				float4 vertex : POSITION;
				float2 uv : TEXCOORD0;
				float3 normal : NORMAL;
			};

			struct v2f
			{
				float2 uv : TEXCOORD0;
				float4 vertex : SV_POSITION;
			};

			sampler2D _MainTex;
			float4 _MainTex_ST;
			fixed4 _OutLineColor;
			float _Scale;
			
			v2f vert (appdata v)
			{
				v2f o;
				v.vertex.xyz = v.vertex.xyz + _Scale * v.normal;
				o.vertex = UnityObjectToClipPos(v.vertex);
				o.uv = TRANSFORM_TEX(v.uv, _MainTex);
				return o;
			}
			
			fixed4 frag (v2f i) : SV_Target
			{
				// sample the texture
				return _OutLineColor;
			}
			ENDCG
		}
	}
}
