// Upgrade NOTE: replaced '_Object2World' with 'unity_ObjectToWorld'

Shader "LearnProject/Graph/Color"
{
	Properties
	{

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
			};

			struct v2f
			{
				float2 uv : TEXCOORD0;
				float4 vertex : SV_POSITION;
				fixed4 color : COLOR;
			};
			
			v2f vert (appdata v)
			{
				v2f o;
				o.vertex = UnityObjectToClipPos(v.vertex);
				float3 worldSpacePos = mul(unity_ObjectToWorld, v.vertex);
				//worldSpacePos = UnityObjectToWorldNormal(float4(v.vertex.xyz, 0));
				o.color = fixed4(worldSpacePos.x * 0.5 + 0.5, worldSpacePos.y * 0.5 + 0.5, 0, 1);
				return o;
			}
			
			fixed4 frag (v2f i) : SV_Target
			{
				return i.color;
			}
			ENDCG
		}
	}
}
