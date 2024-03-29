#version 330 core
out vec4 FragColor;

in vec2 TexCoords;

uniform sampler2D screenTexture;

//像素偏移量，自己定义的
const float offset = 1.0 / 300.0;

void main()
{
    vec2 offsets[9] = vec2[](
        vec2(-offset,  offset), // 左上
        vec2( 0.0f,    offset), // 正上
        vec2( offset,  offset), // 右上
        vec2(-offset,  0.0f),   // 左
        vec2( 0.0f,    0.0f),   // 中
        vec2( offset,  0.0f),   // 右
        vec2(-offset, -offset), // 左下
        vec2( 0.0f,   -offset), // 正下
        vec2( offset, -offset)  // 右下
    );

    //核矩阵
    float kernel[9] = float[](
        -1, -1, -1,
        -1,  9, -1,
        -1, -1, -1
    );

    //计算每个偏移像素的颜色
    vec3 sampleTex[9];
    for (int i = 0; i < 9; i++) 
    {
        sampleTex[i] = vec3(texture(screenTexture, TexCoords + offsets[i]));
    }

    //最终颜色
    vec3 resultColor = vec3(0.0);
    for (int i = 0; i < 9; i++) 
    {
        resultColor = resultColor + sampleTex[i] * kernel[i];
    }

    FragColor = vec4(resultColor, 1.0);
} 