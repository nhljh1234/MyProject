#version 330 core
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 inColor;
layout (location = 2) in vec2 aTexCoord;

out vec3 userColor;
out vec2 texCoord;

uniform mat4 transform; 

void main()
{
    gl_Position = transform * vec4(aPos, 1.0f);
    userColor = inColor;
    texCoord = aTexCoord;
}