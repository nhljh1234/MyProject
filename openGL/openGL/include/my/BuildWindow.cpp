#include <my/BuildWindow.h>

#include <iostream>
#include <fstream>
#include <string>

void changeWindowSizeCallBack(GLFWwindow* window, int width, int height)
{
	glViewport(0, 0, width, height);
}

GLFWwindow* createOpenGLWindow()
{
	//初始化GLFW
	glfwInit();
	//设置主版本号
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	//设置子版本号
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	//设置编程模式为核心模式
	//介绍：https://learnopengl-cn.github.io/01%20Getting%20started/01%20OpenGL/
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	//创建窗口
	GLFWwindow *window = glfwCreateWindow(800, 600, "build_window", NULL, NULL);
	if (window == NULL)
	{
		//创建失败
		std::cout << "build failed" << std::endl;
		return 0;
	}
	//设置这个窗口的上下文为当前线程的主上下文
	glfwMakeContextCurrent(window);

	//这一步很重要，初始化GLAD，调用任何OpenGL的函数之前先要初始化GLAD
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return NULL;
	}

	//设置渲染窗口的大小
	//前两个参数表示左下角的坐标
	//后面两个参数分别控制宽度和高度
	//OpenGL会根据这个渲染窗口的大小来计算实际坐标，OpenGL的坐标处理后都是(-1到1)之间
	glViewport(0, 0, 800, 600);

	//注册一个事件，当窗口尺寸改变后需要重新设置视图大小
	glfwSetFramebufferSizeCallback(window, changeWindowSizeCallBack);

	return window;
}

void closeWindow()
{
	glfwTerminate();
}
