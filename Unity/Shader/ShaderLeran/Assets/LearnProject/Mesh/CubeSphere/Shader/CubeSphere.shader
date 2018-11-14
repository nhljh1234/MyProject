Shader "LearnProject/CubeSphere/Color"
{
	Properties
	{
		_MainTex ("Texture", 2D) = "white" {}
		_Color ("Color", Color) = (1, 0, 0, 1)
		[KeywordEnum(X, Y, Z)] _Faces ("Faces", Float) = 0
	}
	SubShader
	{
		Tags { "RenderType"="Opaque" }
		LOD 100

		Pass
		{
			CGPROGRAM
			#pragma shader_feature _FACES_X _FACES_Y _FACES_Z
			#pragma vertex vert
			#pragma fragment frag
			
			#include "UnityCG.cginc"

			struct appdata
			{
				float4 vertex : POSITION;
				fixed4 color : COLOR;
				float2 uv : TEXCOORD0;
			};

			struct v2f
			{
				float2 uv : TEXCOORD0;
				float4 vertex : SV_POSITION;
			};

			sampler2D _MainTex;
			float4 _MainTex_ST;
			fixed4 _Color;
			
			v2f vert (appdata v)
			{
				v2f o;
				o.vertex = UnityObjectToClipPos(v.vertex);
				o.uv = TRANSFORM_TEX(v.uv, _MainTex);
				#if defined(_FACES_X)
					o.uv = v.color.yz * 255;
				#elif defined(_FACES_Y)
					o.uv = v.color.xz * 255;
				#elif defined(_FACES_Z)
					o.uv = v.color.xy * 255;
				#endif
				return o;
			}
			
			fixed4 frag (v2f i) : SV_Target
			{
				fixed4 col = tex2D(_MainTex, i.uv);
				return _Color * col;
			}
			ENDCG
		}
	}
}
