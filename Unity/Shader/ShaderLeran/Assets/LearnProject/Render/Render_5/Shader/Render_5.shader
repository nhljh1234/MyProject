//ForwardBase执行了一次
//ForwardAdd每个光源会执行一次
Shader "LearnProject/Render/Render_5/Color"
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
			
			#include "render_5_lights_frag.cginc"

			ENDCG
		}

		Pass
		{
			Tags{ "LightMode" = "ForwardAdd" }

			Blend One One
			ZWrite Off
			
			CGPROGRAM

			#define USER_BASE

			#pragma vertex vert
			#pragma fragment frag
			
			#pragma multi_compile DIRECTIONAL POINT SPOT

			#include "render_5_lights_frag.cginc"

			ENDCG
		}
	}
	Fallback "Diffuse"
}
