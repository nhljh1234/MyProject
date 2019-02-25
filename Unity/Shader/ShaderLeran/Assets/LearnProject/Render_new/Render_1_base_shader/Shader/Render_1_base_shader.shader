Shader "Render_new/Render_1_base_shader"
{
	Properties
	{
		_MainTex ("Texture", 2D) = "white" {}
		_Alpha ("Alpha", Float) = 1
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
				float4 vertex : SV_POSITION;
			};

			sampler2D _MainTex;
			float4 _MainTex_ST;
			float _Alpha;
			
			v2f vert (appdata v)
			{
				v2f o;
				o.vertex = UnityObjectToClipPos(v.vertex);
				//o.vertex = v.vertex;
				//o.vertex.y = -1 * o.vertex.y;
				o.uv = TRANSFORM_TEX(v.uv, _MainTex);
				//o.uv.y = -1 * o.uv.y;
				return o;
			}
			
			fixed4 frag (v2f i) : SV_Target
			{
				// sample the texture
				//fixed4 col = tex2D(_MainTex, i.uv);
				return fixed4(0, 0, _Alpha, 1);
			}
			ENDCG
		}
	}
}
