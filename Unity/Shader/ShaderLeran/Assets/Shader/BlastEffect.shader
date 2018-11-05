//边缘光效果
Shader "MyShader/BlastEffect"
{
	Properties
	{
		_MainTex ("Texture", 2D) = "white" {}
		_PlayTime ("PlayTime", range(0, 1)) = 0.6
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
			#pragma geometry geom
			#pragma fragment frag
			
			#include "UnityCG.cginc"

			struct appdata
			{
				float4 vertex : POSITION;
				float2 uv : TEXCOORD0;
			};

			struct v2g 
			{ 
				float4 vertex : SV_POSITION; 
				float2 uv : TEXCOORD0;
			};

			struct g2f
			{
				float4 vertex : SV_POSITION; 
				float2 uv : TEXCOORD0;
			};

			sampler2D _MainTex;
			float4 _MainTex_ST;
			float _PlayTime;
			
			v2g vert (appdata v)
			{
				v2g g;
				g.vertex = v.vertex;
				g.uv = TRANSFORM_TEX(v.uv, _MainTex);
				return g;
			}

 			[maxvertexcount(3)]
			void geom (triangle v2g p[3], inout TriangleStream<g2f> triStream)
			{
				//计算三个点的法向量
				//屏幕坐标的顶点位置
				float3 p0 = p[0].vertex.xyz;
				float3 p1 = p[1].vertex.xyz;
				float3 p2 = p[2].vertex.xyz;
				//三角形三条边的矢量方向
				float3 v0 = p2 - p1;
				float3 v1 = p2 - p0;
				float3 v2 = p1 - p0;
				//计算三角形的法线
				float3 triangleNormal = normalize(cross(v1, v2));

				g2f pIn;
				//输入第一个点
				pIn.vertex = UnityObjectToClipPos(p[0].vertex - float4(_PlayTime * triangleNormal, 0));
				pIn.uv = p[0].uv;
				triStream.Append(pIn);

				//输入第二个点
				pIn.vertex = UnityObjectToClipPos(p[1].vertex - float4(_PlayTime * triangleNormal, 0));
				pIn.uv = p[1].uv;
				triStream.Append(pIn);

				//输入第三个点
				pIn.vertex = UnityObjectToClipPos(p[2].vertex - float4(_PlayTime * triangleNormal, 0));
				pIn.uv = p[2].uv;
				triStream.Append(pIn);
			}
			
			fixed4 frag (g2f i) : SV_Target
			{
				return fixed4(tex2D(_MainTex, i.uv).rgb, 1 - _PlayTime);
			}
			ENDCG
		}
	}
}
