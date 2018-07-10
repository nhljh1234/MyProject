#version 330 core
out vec4 FragColor;

in vec3 userColor;
in vec2 texCoord;

uniform sampler2D ourTexture1;
uniform sampler2D ourTexture2;
uniform float mixNum;

void main()
{
    FragColor = mix(texture(ourTexture1, texCoord), texture(ourTexture2, vec2(1.0 - texCoord.x, 1.0 - texCoord.y)), mixNum);
} 