#version 330 core
layout (triangles) in;
layout (line_strip, max_vertices = 6) out;

in VS_OUT {
    vec3 Normal;
} gs_in[];

void drawNormal(int index)
{
    gl_Position = gl_in[index].gl_Position;
    EmitVertex();
    gl_Position = gl_in[index].gl_Position + vec4(gs_in[index].Normal, 0.0) * 0.1;
    EmitVertex();
    EndPrimitive(); 
}

void main() 
{   
    drawNormal(0);
    drawNormal(1);
    drawNormal(2);
    //一开始就要设置颜色   
}