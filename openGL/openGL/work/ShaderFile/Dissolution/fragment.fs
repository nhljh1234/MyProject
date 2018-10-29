#version 330 core
out vec4 FragColor;

in vec2 TexCoords;

uniform sampler2D texture_diffuse_1;
uniform sampler2D texture_specular_1;

uniform float num;

void main()
{    
    FragColor = texture(texture_diffuse_1, TexCoords);

    if (FragColor.r < num) 
    {
        discard;
    }

    if (FragColor.r < num + 0.1 && num > 0.1) 
    {
        float addNum = (FragColor.r - num) / 0.1;
        FragColor = vec4(addNum, addNum, addNum, 1.0);
    }
}