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
			
			#include "render_5_lights.cginc"

			ENDCG
		}

		Pass
		{
			Tags{ "LightMode" = "ForwardAdd" }

			Blend One One
			ZWrite Off
			
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			
			#include "UnityCG.cginc"
			#include "Lighting.cginc"

			#include "render_5_lights.cginc"

			ENDCG
		}
	}
	Fallback "Diffuse"
}
