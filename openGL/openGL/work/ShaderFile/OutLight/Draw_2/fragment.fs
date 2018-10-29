#version 330 core
out vec4 FragColor;

in vec2 TexCoords;

uniform sampler2D texture_diffuse_1;
uniform sampler2D texture_specular_1;

uniform float num;

void main()
{    
    FragColor = texture(texture_diffuse_1, TexCoords);
}