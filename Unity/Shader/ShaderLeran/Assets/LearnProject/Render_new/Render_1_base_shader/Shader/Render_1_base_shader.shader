Shader "Render_new/Render_1_base_shader"
{
	Properties
	{
		_MainTex ("Texture", 2D) = "white" {}
		_Color ("Color", Color) = (1, 1, 1, 0)
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
			// make fog work
			
			#include "UnityCG.cginc"

			struct appdata
			{
				float4 vertex : POSITION;
				float2 uv : TEXCOORD0;
			};

			struct v2f
			{
				float2 uv : TEXCOORD0;
				fixed3 vertexObject : TEXCOORD1;
				float4 vertex : SV_POSITION;
			};

			sampler2D _MainTex;
			float4 _MainTex_ST;
			fixed4 _Color;
			
			v2f vert (appdata v)
			{
				v2f o;
				o.vertexObject = v.vertex.xyz;
				o.vertex = UnityObjectToClipPos(v.vertex);
				//o.vertex.x = o.vertex.x + 1;
				//o.vertex = v.vertex;
				//o.vertex.y = -1 * o.vertex.y;
				o.uv = TRANSFORM_TEX(v.uv, _MainTex);
				return o;
			}
			
			fixed4 frag (v2f i) : SV_Target
			{
				// sample the texture
				//fixed4 col = tex2D(_MainTex, i.uv);
				//return fixed4(i.vertexObject + 0.5, 1) * tex2D(_MainTex, i.uv);
				return tex2D(_MainTex, i.uv);
			}
			ENDCG
		}
	}
}
