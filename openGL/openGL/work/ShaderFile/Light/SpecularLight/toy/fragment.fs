#version 330 core
out vec4 FragColor;

in vec3 normal;
in vec3 fragPos;

uniform vec3 toyColor;
uniform vec3 lightColor;
uniform float ambientStrength;
uniform vec3 lightPos;

void main()
{
    vec3 lightDir = normalize(lightPos - fragPos);
    vec3 norm = normalize(normal);
    
    //dot 向量x，y之间的点积
    float diff = max(dot(norm, lightDir), 0.0f);

    vec3 diffuseLight = diff * lightColor;
    vec3 ambientLight = ambientStrength * lightColor;

    vec3 result = (ambientLight + diffuseLight) * toyColor;
    FragColor = vec4(result, 1.0f);
} 