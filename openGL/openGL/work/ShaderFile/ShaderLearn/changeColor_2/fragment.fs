#version 330 core
out vec4 FragColor;
in vec3 inColor;

void main()
{
    FragColor = vec4(inColor, 1.0f);
} 