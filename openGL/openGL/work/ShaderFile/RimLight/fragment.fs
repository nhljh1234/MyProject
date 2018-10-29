//边缘光
#version 330 core
out vec4 FragColor;

in vec2 TexCoords;
in vec3 Normal;
in vec3 FragPos;

uniform sampler2D texture_diffuse_1;
uniform sampler2D texture_specular_1;

uniform vec3 RimLightColor;
uniform vec3 viewPos;

void main()
{    
    FragColor = texture(texture_diffuse_1, TexCoords);
    //视线方向
    vec3 viewDir = normalize(viewPos - FragPos);
    float num = 0.4 - max(dot(viewDir, normalize(Normal)), 0);
    if (num > 0) 
    {
        FragColor = vec4(FragColor.rgb + RimLightColor * num, 1.0);
    }
}