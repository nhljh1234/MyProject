//边缘光效果
Shader "MyShader/RimLight"
{
	Properties
	{
		_MainTex ("Texture", 2D) = "white" {}
		_RimLightColor ("RimLightColor", Color) = (0.5, 0, 0, 1)
		_Scale ("RIM_SCALE", range(0, 1)) = 0.6
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
				float3 worldNormal : TEXCOORD1;
				float3 worldViewDir : TEXCOORD2;
			};

			sampler2D _MainTex;
			float4 _MainTex_ST;
			fixed4 _RimLightColor;
			float _Scale;
			
			v2f vert (appdata v)
			{
				v2f o;
				o.vertex = UnityObjectToClipPos(v.vertex);
				o.uv = TRANSFORM_TEX(v.uv, _MainTex);
				//o.worldNormal = normalize(mul(v.normal, (float3x3)unity_WorldToObject));
				o.worldNormal = UnityObjectToWorldNormal(v.normal);
				o.worldViewDir = WorldSpaceViewDir(v.vertex);
				return o;
			}
			
			fixed4 frag (v2f i) : SV_Target
			{
				// sample the texture
				fixed4 color = tex2D(_MainTex, i.uv);
				float rim = max(_Scale - dot(i.worldNormal, i.worldViewDir), 0);
				return color + rim * _RimLightColor;
			}
			ENDCG
		}
	}
}
