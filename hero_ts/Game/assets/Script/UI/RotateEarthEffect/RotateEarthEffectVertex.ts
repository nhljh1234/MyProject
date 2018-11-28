export let RotateEarthEffectVertexCode = `
    uniform mat4 viewProj;
    uniform mat4 model;
    attribute vec3 a_position;
    attribute vec2 a_uv0;
    varying vec2 uv0;
    void main () {
        mat4 mvp;
        mvp = viewProj * model;

        vec4 pos = mvp * vec4(a_position, 1);
        gl_Position = pos;
        uv0 = a_uv0;
    }
`;