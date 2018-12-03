Shader "LearnProject/Render/Render_5/Color_vert"
{
	Properties
	{
		_MainTex ("Texture", 2D) = "white" {}
		_shininess ("shininess", Int) = 10
	}
	SubShader
	{
		Tags { "RenderType"="Opaque" }
		LOD 100

		Pass
		{

			Tags{ "LightMode" = "ForwardBase" }

			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			
			#pragma multi_compile _ VERTEXLIGHT_ON

			#include "UnityCG.cginc"
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
				float3 color : COLOR;
			};

			sampler2D _MainTex;
			float4 _MainTex_ST;
			int _shininess;
			
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
				#ifdef VERTEXLIGHT_ON
				o.color = Shade4PointLights (
					unity_4LightPosX0, unity_4LightPosY0, unity_4LightPosZ0,
				    unity_LightColor[0].rgb, unity_LightColor[1].rgb, unity_LightColor[2].rgb, unity_LightColor[3].rgb,
				    unity_4LightAtten0, worldPos, worldNormal);
				#endif // VERTEXLIGHT_ON
				return o;
			}
			
			fixed4 frag (v2f i) : SV_Target
			{
				return float4(i.color, 1) * tex2D(_MainTex, i.uv);
			}
			ENDCG
		}
	}
	Fallback "Diffuse"
}
