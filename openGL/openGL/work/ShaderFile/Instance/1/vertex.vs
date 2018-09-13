#version 330 core
layout (location = 0) in vec2 aPos;
layout (location = 1) in vec3 inColor;

out vec3 userColor;

uniform vec2 offsets[100];

void main()
{
    userColor = inColor + vec3(0.01, 0.01, 0.01) * gl_InstanceID;
    gl_Position = vec4(aPos + offsets[gl_InstanceID], 0.0, 1.0);
}