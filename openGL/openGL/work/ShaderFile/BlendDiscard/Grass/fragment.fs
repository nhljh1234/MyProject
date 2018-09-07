#version 330 core
in vec2 TexCoords;
out vec4 FragColor;

uniform sampler2D textureImg;

void main()
{    
    vec4 outColor = texture(textureImg, TexCoords);
    if (outColor.a < 0.1)
    {
        //保证这个片段不会被进一步处理
        discard;
    }
    FragColor = outColor;
}