#version 330 core
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;
layout (location = 2) in vec2 aTexCoords;

uniform mat4 model[1000];
uniform mat4 view;
uniform mat4 projection;

out vec2 TexCoords;

void main()
{
    TexCoords = aTexCoords;
    gl_Position = projection * view * model[gl_InstanceID] * vec4(aPos, 1.0);
}