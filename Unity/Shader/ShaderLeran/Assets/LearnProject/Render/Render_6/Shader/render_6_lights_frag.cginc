#if !defined(RENDER_5_LIGHTS)
#define RENDER_5_LIGHTS

#include "UnityCG.cginc"
#include "Lighting.cginc"
#include "Autolight.cginc" 
#include "UnityPBSLighting.cginc"

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
	float3 normal : NORMAL;
	float4 vertex_i : TEXCOORD1;
};

sampler2D _MainTex;
sampler2D _NormalMap;
float4 _MainTex_ST;
int _shininess;
			
void getHeightMapNormal (inout v2f o) 
{
	//fixed4 heightMapColor = tex2D(_NormalMap, o.uv);
	//o.normal = normalize(float3(0, heightMapColor.x, 0));
	o.normal = tex2D(_NormalMap, o.uv).rgb * 2 - 1;
	//o.normal = o.normal.rbg;
	o.normal = normalize(o.normal);
}

v2f vert (appdata v)
{
	v2f o;
	o.vertex_i = v.vertex;
	o.vertex = UnityObjectToClipPos(v.vertex);
	o.uv = TRANSFORM_TEX(v.uv, _MainTex);
	o.normal = v.normal;
	return o;
}
			
fixed4 frag (v2f i) : SV_Target
{
	getHeightMapNormal(i);
	float3 lightColor = _LightColor0.rgb;
	float3 lightPos = _WorldSpaceLightPos0.xyz;
	float3 worldNormal = UnityObjectToWorldNormal(i.normal);

	float3 worldPos = mul(unity_ObjectToWorld, i.vertex_i);
	float3 viewDir = normalize(_WorldSpaceCameraPos - worldPos);
	float3 lightDir;

	#if defined(POINT) || defined(SPOT)
		lightDir = normalize(lightPos - worldPos);
	#else
		lightDir = lightPos;
	#endif

	//距离系数
	float dis = length(lightPos - worldPos);
	float F = 1 / (1 + dis * 0.2 + dis * dis * 0.005);
	//全局光照
	#if defined(USER_BASE)
		float3 ambient = float3(0, 0, 0);
	#else
		float3 ambient = UNITY_LIGHTMODEL_AMBIENT.xyz;
	#endif
	//漫反射光
	float3 diffLightColor = max(dot(worldNormal, lightDir), 0) * lightColor;
	//镜面放射光
	float3 reflectDir = reflect(-1 * lightDir, worldNormal);
	float3 specularLightColor = pow(max(dot(viewDir, reflectDir), 0), _shininess) * lightColor;
	fixed4 color = fixed4(ambient.r, ambient.g, ambient.b, 1) + fixed4(diffLightColor.r, diffLightColor.g, diffLightColor.b, 1) + fixed4(specularLightColor.r, specularLightColor.g, specularLightColor.b, 1);
	UNITY_LIGHT_ATTENUATION(attenuation, 0, worldPos);
	return color * tex2D(_MainTex, i.uv) * attenuation;
}

#endif