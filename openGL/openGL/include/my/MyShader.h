#ifndef SHADER_H
#define SHADER_H

#include <glad/glad.h>

#include <string>
#include <fstream>
#include <sstream>
#include <iostream>


class MyShader
{
public:
    // 程序ID
    unsigned int ID;

    // 构造器读取并构建着色器
	MyShader(const char* vertexPath, const char* fragmentPath, const char* geometryPath = nullptr);
    // 使用/激活程序
    void use();
};

#endif