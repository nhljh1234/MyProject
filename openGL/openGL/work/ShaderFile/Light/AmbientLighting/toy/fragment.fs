#version 330 core
out vec4 FragColor;

uniform vec3 toyColor;
uniform vec3 lightColor;
uniform float ambientStrength;

void main()
{
    FragColor = vec4(lightColor * toyColor * ambientStrength, 1.0f);
} 