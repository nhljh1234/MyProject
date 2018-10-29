#version 330 core
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;
layout (location = 2) in vec2 aTexCoords;

out vec2 TexCoords;
out vec3 Normal;
out vec3 FragPos;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
    TexCoords = aTexCoords;    
    //世界坐标位置
    FragPos = vec3((model * (vec4(aPos, 1.0f))).xyz);
    //inverse 逆矩阵
    //transpose 转置矩阵
    //对应不等比缩放时导致的法向量变化，这边需要使用一个法线矩阵
    Normal = mat3(transpose(inverse(model))) * aNormal;
    gl_Position = projection * view * model * vec4(aPos, 1.0);
}