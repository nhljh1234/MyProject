//模糊
Shader "MyShader/GaussianBlur"
{
	Properties
	{
		_MainTex ("Texture", 2D) = "white" {}
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
			static float _gaussianArr[9] = {0.09467416, 0.118318, 0.0947416, 0.118318, 0.147761, 0.118318, 0.0947416, 0.118318, 0.09467416};
			
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
				int x, y, count = 0;
				fixed4 colorResult;
				for (x = -1; x <= 1; x++) 
				{
					for (y = -1; y <= 1; y++) 
					{
						colorResult = colorResult + tex2D(_MainTex, i.uv + _MainTex_TexelSize.xy * float2(x, y)) * _gaussianArr[count];
						count++;
					}
				}
				//return fixed4(1, 1, 0, 1);
				return colorResult;
			}
			ENDCG
		}
	}
}
