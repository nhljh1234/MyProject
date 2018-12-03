//模糊
Shader "MyShader/SkyEffect"
{
	Properties
	{
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_FogColor ("Fog Color", Color) = (1, 1, 1, 1)
		_NoiseTex ("Noise Texture", 2D) = "white" {}        // 噪声纹理
		_FogDensity ("Fog Density", Float) = 1.0
		_FogAlpha ("Fog Alpha", Float) = 1.0
		_NoiseAmount ("Noise Amount", Float) = 1
		_SpeedX ("SpeedX", Float) = 1
		_SpeedY ("SpeedY", Float) = 1
	}
	SubShader
	{
		Tags { "RenderType"="Opaque" }
		LOD 100

		Blend SrcAlpha OneMinusSrcAlpha

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

			float _FogDensity;
			float _FogAlpha;
			float4 _FogColor;
			sampler2D _NoiseTex;
			float _NoiseAmount;
			float _SpeedX;
			float _SpeedY;
			
			v2f vert (appdata v)
			{
				v2f o;
				o.vertex = UnityObjectToClipPos(v.vertex);
				o.uv = TRANSFORM_TEX(v.uv, _MainTex);
				return o;
			}
			
			float rand(float2 n)
			{
				return frac(cos(dot(n, float2(12.9898, 4.1414))) * 43758.5453);
			}
			
			float noise(float2 n)
			{
				float2 d = float2(0.0, 1.0);
				float2 b = floor(n), f = smoothstep(float2(0, 0), float2(1, 1), frac(n));
				return lerp(lerp(rand(b), rand(b + d.yx), f.x), lerp(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
			}

			float sharpening(float density)
			{
				return ceil(density * 100) / 100;
			}

			fixed4 frag (v2f i) : SV_Target
			{
				
				float total = 0.0;
				float2 pos = i.uv * _NoiseAmount;
				total += noise(pos * 1.0 + float2(fmod(_Time.x * _SpeedX * 2.0, 200), 0.0));
				total += noise(pos * 2.0 + float2(0.0, fmod(_Time.y * _SpeedY * 3.0, 300))) * 0.5;
				total += noise(pos * 4.0 + float2(fmod(_Time.x * _SpeedX * 4.0, 400), 0.0)) * 0.25;
				total += noise(pos * 8.0 + float2(0.0, fmod(_Time.y * _SpeedY * 5.0, 500))) * 0.125;

				float resultDensity = total * _FogDensity;
				//resultDensity = sharpening(resultDensity);

				float3 resultColor = _FogColor * resultDensity;

				return fixed4(resultColor, _FogAlpha);
			}
			ENDCG
		}
	}
}
