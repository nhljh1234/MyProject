#version 330 core
out vec4 FragColor;

in vec3 userColor;

void main()
{
    FragColor = vec4(userColor, 1.0);
} 