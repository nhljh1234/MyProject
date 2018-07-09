#pragma once
#include <glad/glad.h>
#include <GLFW/glfw3.h>

//创建一个窗口
GLFWwindow* createOpenGLWindow();
//窗口关闭的时候清除缓冲
void closeWindow();
