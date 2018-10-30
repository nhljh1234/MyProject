//溶解效果
Shader "MyShader/Dissolution"
{
	Properties
	{
		_MainTex ("Texture", 2D) = "white" {}
		_NoiseTex ("NoiseTex", 2D) = "white" {}
		_DissolutionNum ("DissolutionNum", Range(0, 1)) = 0.5
		_DissolutionInNum ("DissolutionOutNum", Range(0, 1)) = 0.08
		_DissolutionOutNum ("DissolutionOutNum", Range(0, 1)) = 0.1
		//溶解内边缘的颜色
		_DissolutionInColor ("DissolutionInColor", Color) = (1, 1, 1, 1)
		//溶解外边缘的颜色
		_DissolutionOutColor ("DissolutionOutColor", Color) = (1, 1, 1, 1)
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
			sampler2D _NoiseTex;
			float4 _MainTex_ST;
			float _DissolutionNum;
			float _DissolutionInNum;
			float _DissolutionOutNum;
			fixed4 _DissolutionInColor;
			fixed4 _DissolutionOutColor;
			
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
				fixed4 color = tex2D(_MainTex, i.uv);
				fixed4 noiseColor = tex2D(_NoiseTex, i.uv);
				if (noiseColor.r <= _DissolutionNum) 
				{
					discard;
				} 
				else if (noiseColor.r > _DissolutionOutNum) 
				{
					if (noiseColor.r < _DissolutionNum + _DissolutionInNum) 
					{
						return _DissolutionInColor;
					} 
					else if (noiseColor.r < _DissolutionNum + _DissolutionOutNum) 
					{
						return _DissolutionOutColor;
					}
				}
				return color;
			}
			ENDCG
		}
	}
}
