Shader "LearnProject/Render/Render_3/Color"
{
	Properties
	{
		_Texture_1 ("Texture_1", 2D) = "white" {}
		_Texture_2 ("Texture_2", 2D) = "white" {}
		_Texture_3 ("Texture_3", 2D) = "white" {}
		_Texture_4 ("Texture_4", 2D) = "white" {}
		_Texture_rgb ("Texture_rgb", 2D) = "white" {}
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
			};

			struct v2f
			{
				float2 uv : TEXCOORD0;
				float4 vertex : SV_POSITION;
			};

			sampler2D _Texture_1;
			sampler2D _Texture_2;
			sampler2D _Texture_3;
			sampler2D _Texture_4;
			sampler2D _Texture_rgb;
			float4 _Texture_1_ST;
			
			v2f vert (appdata v)
			{
				v2f o;
				o.vertex = UnityObjectToClipPos(v.vertex);
				o.uv = TRANSFORM_TEX(v.uv, _Texture_1);
				return o;
			}
			
			fixed4 frag (v2f i) : SV_Target
			{
				fixed4 rgbColor = tex2D(_Texture_rgb, i.uv);
				return tex2D(_Texture_1, i.uv) * rgbColor.r + 
					tex2D(_Texture_2, i.uv) * rgbColor.g + 
					tex2D(_Texture_3, i.uv) * rgbColor.b + 
					tex2D(_Texture_4, i.uv) * (1 - rgbColor.r - rgbColor.g - rgbColor.b);
			}
			ENDCG
		}
	}
}
