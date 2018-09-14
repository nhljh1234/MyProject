#ifndef TOOL_H
#define TOOL_H

#include <glad/glad.h> // holds all OpenGL type declarations

#define STB_IMAGE_IMPLEMENTATION
#include <img/stb_image.h>

#include <string>
#include <map>
#include <vector>
using namespace std;

unsigned int loadTexture(const char* path, GLint SWrap = GL_REPEAT, GLint TWrap = GL_REPEAT)
{
	unsigned int textureID;

	glGenTextures(1, &textureID);

	int width, height, colorChannelNum;
	unsigned char*  imageData = stbi_load(path, &width, &height, &colorChannelNum, 0);
	if (imageData)
	{
		GLenum format;
		if (colorChannelNum == 1)
		{
			format = GL_RED;
		}
		else if (colorChannelNum == 3)
		{
			format = GL_RGB;
		}
		else if (colorChannelNum == 4)
		{
			format = GL_RGBA;
		}

		glBindTexture(GL_TEXTURE_2D, textureID);
		glTexImage2D(GL_TEXTURE_2D, 0, format, width, height, 0, format, GL_UNSIGNED_BYTE, imageData);
		glGenerateMipmap(GL_TEXTURE_2D);

		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, SWrap);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, TWrap);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
	}
	else
	{
		std::cout << "Texture failed to load at path: " << path << std::endl;
	}
	stbi_image_free(imageData);
	glBindTexture(GL_TEXTURE0, textureID);
	return textureID;
}

//获取立方体贴图
unsigned int loadCubeMap(vector<string> imgPathVector)
{
	unsigned int textureID;

	glGenTextures(1, &textureID);
	glBindTexture(GL_TEXTURE_CUBE_MAP, textureID);

	int width, height, colorChannelNum;
	unsigned char* imgData;
	for (int i = 0; i < imgPathVector.size(); i++)
	{
		unsigned char*  imageData = stbi_load(imgPathVector[i].c_str(), &width, &height, &colorChannelNum, 0);
		if (imageData)
		{
			GLenum format;
			if (colorChannelNum == 1)
			{
				format = GL_RED;
			}
			else if (colorChannelNum == 3)
			{
				format = GL_RGB;
			}
			else if (colorChannelNum == 4)
			{
				format = GL_RGBA;
			}

			glTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, format, width, height, 0, format, GL_UNSIGNED_BYTE, imageData);

			glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
			glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
			glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
			glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
			glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_WRAP_R, GL_CLAMP_TO_EDGE);
		}
		else
		{
			std::cout << "Texture failed to load at path: " << imgPathVector[i] << std::endl;
		}
		stbi_image_free(imageData);
	}

	return textureID;
}

//获取一个空的纹理数据
unsigned int getNullTexture(int width, int height, int colorChannelNum = 3)
{
	unsigned int textureID;
	glGenTextures(1, &textureID);
	glBindTexture(GL_TEXTURE_2D, textureID);

	GLenum format;
	if (colorChannelNum == 1)
	{
		format = GL_RED;
	}
	else if (colorChannelNum == 3)
	{
		format = GL_RGB;
	}
	else if (colorChannelNum == 4)
	{
		format = GL_RGBA;
	}

	//仅仅分配了内存而没有填充
	glTexImage2D(GL_TEXTURE_2D, 0, format, width, height, 0, format, GL_UNSIGNED_BYTE, NULL);

	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	return textureID;
}

//获取一个空的多重采样纹理数据
unsigned int getNullMultiSampledTexture(int width, int height, int colorChannelNum = 3, int samples = 4)
{
	unsigned int textureID;
	glGenTextures(1, &textureID);
	glBindTexture(GL_TEXTURE_2D_MULTISAMPLE, textureID);

	GLenum format;
	if (colorChannelNum == 1)
	{
		format = GL_RED;
	}
	else if (colorChannelNum == 3)
	{
		format = GL_RGB;
	}
	else if (colorChannelNum == 4)
	{
		format = GL_RGBA;
	}

	//仅仅分配了内存而没有填充
	glTexImage2DMultisample(GL_TEXTURE_2D_MULTISAMPLE, samples, colorChannelNum, width, height, GL_TRUE);

	return textureID;
}

//获取一个空的深度缓冲纹理数据
unsigned int getNullDepthTexture(int width, int height)
{
	unsigned int textureID;
	glGenTextures(1, &textureID);
	glBindTexture(GL_TEXTURE_2D, textureID);

	//仅仅分配了内存而没有填充
	glTexImage2D(GL_TEXTURE_2D, 0, GL_DEPTH24_STENCIL8, width, height, 0, GL_DEPTH_STENCIL, GL_UNSIGNED_INT_24_8, NULL);

	return textureID;
}

#endif