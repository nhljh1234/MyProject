//模糊
Shader "MyShader/Blur"
{
	Properties
	{
		_MainTex ("Texture", 2D) = "white" {}
		//这个数值越大，采样越多
		_Scale ("Scale", Int) = 1
	}
	SubShader
	{
		Tags { "RenderType"="Opaque" }
		LOD 100

		Pass
		{
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
			float4 _MainTex_TexelSize;
			int _Scale;
			
			v2f vert (appdata v)
			{
				v2f o;
				o.vertex = UnityObjectToClipPos(v.vertex);
				o.uv = TRANSFORM_TEX(v.uv, _MainTex);
				return o;
			}
			
			fixed4 frag (v2f i) : SV_Target
			{
				int scale;
				int count = 0;
				scale = _Scale > 10 ? 10 : _Scale;
				// sample the texture
				fixed4 colorResult;
				int x, y;
				for (x = -1 * scale; x <= scale; x++) 
				{
					for (y = -1 * scale; y <= scale; y++) 
					{
						colorResult = colorResult + tex2D(_MainTex, i.uv + _MainTex_TexelSize.xy * float2(x, y));
						count++;
					}
				}
				//return fixed4(1, 1, 0, 1);
				return colorResult / count;
			}
			ENDCG
		}
	}
}
