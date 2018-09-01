#ifndef MESH_H
#define MESH_H

#include <glad/glad.h> // holds all OpenGL type declarations

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

#include <my/MyShader.h>

#include <string>
#include <fstream>
#include <sstream>
#include <iostream>
#include <vector>
using namespace std;

struct Vertex {
	//位置
	glm::vec3 Position;
	//法线
	glm::vec3 Normal;
	//纹理位置
	glm::vec2 TexCoords;
	//切线
	glm::vec3 Tangent;
	glm::vec3 Bitangent;
	//我们称tangant轴（T）、bitangent轴（B）及Normal轴（N）所组成的坐标系，即切线空间（TBN）。
	//切线空间是辅助纹理坐标的
};

struct Texture {
	//纹理id
	unsigned int id;
	string type;
	//存储纹理路径用于判断是否加载过了
	string path;
};

class MyMesh {
public:
	//顶点集合
	vector<Vertex> vertices;
	//索引集合
	vector<unsigned int> indices;
	//纹理集合
	vector<Texture> textures;
	//顶点数组对象
	unsigned int VAO;
	//构造函数
	MyMesh(vector<Vertex> vertices, vector<unsigned int> indices, vector<Texture> textures)
	{
		this->vertices = vertices;
		this->indices = indices;
		this->textures = textures;

		setupMesh();
	}
	//绘制函数
	//规范化命名
	/*
		uniform sampler2D texture_diffuse_1;
		uniform sampler2D texture_diffuse_2;
		uniform sampler2D texture_diffuse_3;
		uniform sampler2D texture_specular_1;
		uniform sampler2D texture_specular_2;
	*/
	void Draw(MyShader shader)
	{
		//计数
		unsigned int diffuseCount = 1;
		unsigned int specularCount = 1;
		unsigned int normalCount = 1;
		unsigned int heightCount = 1;
		//设置纹理
		for (unsigned int i = 0; i < textures.size(); i++) {
			glActiveTexture(GL_TEXTURE0 + i);
			glBindTexture(GL_TEXTURE_2D, textures[i].id);

			string number;
			string name = textures[i].type;
			if (name == "texture_diffuse") {
				number = std::to_string(diffuseCount++);
			}
			else if (name == "texture_specular") {
				number = std::to_string(specularCount++);
			}
			else if (name == "texture_normal") {
				number = std::to_string(normalCount++);
			}
			else if (name == "texture_height") {
				number = std::to_string(heightCount++);
			}

			glUniform1i(glGetUniformLocation(shader.ID, (name + "_" + number).c_str()), i);
		}
		//开始绘制
		glBindVertexArray(VAO);
		glDrawElements(GL_TRIANGLES, indices.size(), GL_UNSIGNED_INT, 0);
		glBindVertexArray(0);
		glActiveTexture(GL_TEXTURE0);
	}
private:
	//渲染参数
	unsigned int VBO, EBO;
	//使用初始化
	void setupMesh()
	{
		//初始化
		glGenVertexArrays(1, &VAO);
		glGenBuffers(1, &VBO);
		glGenBuffers(1, &EBO);

		//绑定
		glBindVertexArray(VAO);

		//写入数据
		glBindBuffer(GL_ARRAY_BUFFER, VBO);
		glBufferData(GL_ARRAY_BUFFER, vertices.size() * sizeof(Vertex), &vertices[0], GL_STATIC_DRAW);

		//写入数据
		glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
		glBufferData(GL_ELEMENT_ARRAY_BUFFER, indices.size() * sizeof(unsigned int), &indices[0], GL_STATIC_DRAW);

		//写入顶点数据
		glEnableVertexAttribArray(0);
		glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)0);
		//法线
		glEnableVertexAttribArray(1);
		//offsetof 会生成一个类型为 size_t 的整型常量，它是一个结构成员相对于结构开头的字节偏移量
		glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, Normal));
		//纹理坐标
		glEnableVertexAttribArray(2);
		glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, TexCoords));
		//切线向量
		glEnableVertexAttribArray(3);
		glVertexAttribPointer(3, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, Tangent));
		glEnableVertexAttribArray(4);
		glVertexAttribPointer(4, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, Bitangent));

		//取消绑定
		glBindVertexArray(0);
	}
};

#endif