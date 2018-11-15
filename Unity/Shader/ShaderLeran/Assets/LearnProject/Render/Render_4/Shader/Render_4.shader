Shader "LearnProject/Render/Render_4/Color"
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
			
			#include "Lighting.cginc"

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
				fixed4 color : COLOR;
			};

			sampler2D _MainTex;
			float4 _MainTex_ST;
			
			v2f vert (appdata v)
			{
				v2f o;
				o.vertex = UnityObjectToClipPos(v.vertex);
				o.uv = TRANSFORM_TEX(v.uv, _MainTex);
				float3 lightColor = _LightColor0.rgb;
				float3 lightPos = _WorldSpaceLightPos0.xyz;
				float3 worldNormal = UnityObjectToWorldNormal(v.normal);
				float3 worldPos = mul(unity_ObjectToWorld, v.vertex);
				float3 viewDir = normalize(_WorldSpaceCameraPos - worldPos);
				float3 lightDir = normalize(lightPos - worldPos);
				//全局光照
				float3 ambient = UNITY_LIGHTMODEL_AMBIENT.xyz;
				//漫反射光
				float3 diffLightColor = max(dot(worldNormal, -1 * lightDir), 0) * lightColor;
				//镜面放射光
				float3 reflectDir = reflect(worldNormal, lightDir);
				float3 specularLightColor = max(dot(viewDir, reflectDir), 0) * lightColor;
				o.color = fixed4(ambient.r, ambient.g, ambient.b, 1) + 
					fixed4(diffLightColor.r, diffLightColor.g, diffLightColor.b, 1) + 
					fixed4(diffLightColor.r, diffLightColor.g, diffLightColor.b, 1) ;
				return o;
			}
			
			fixed4 frag (v2f i) : SV_Target
			{
				return i.color * tex2D(_MainTex, i.uv);
			}
			ENDCG
		}
	}
}
