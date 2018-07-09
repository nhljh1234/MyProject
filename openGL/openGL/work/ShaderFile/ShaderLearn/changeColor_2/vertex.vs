#version 330 core
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 userColor;

out vec3 inColor;
uniform float addX;

void main()
{
    gl_Position = vec4(-1.0 * aPos.x + addX, -1.0 * aPos.y, -1.0 * aPos.z, 1.0f);
    inColor = userColor;
}