Shader "SRP/SRP_3/lit"
{
    Properties
    {
        _Color ("Color", Color) = (1, 1, 1, 1)
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        LOD 100

        Pass
        {
            HLSLPROGRAM

            #pragma multi_compile_instancing
            #pragma instancing_options assumeuniformscaling

            #pragma vertex PassVertex
            #pragma fragment PassFragment

            #include "lit.hlsl"

            ENDHLSL
        }
    }
}
