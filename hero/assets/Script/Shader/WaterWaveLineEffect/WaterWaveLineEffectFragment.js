var outModule = {};

outModule.getCodeStr = () => {
    return `
        #ifdef GL_ES
        precision lowp float;
        #endif
        
        varying vec4 v_fragmentColor;
        varying vec2 v_texCoord;
        
        uniform float waveNum;
        uniform float waveMoveNum;
        uniform float addX;

        void main()
        {
            //总弧度
            float totalRadian = waveNum * 3.1415926;
            float xRadian = v_texCoord.x * totalRadian + addX;
            float yAdd = sin(xRadian) * waveMoveNum;
            gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, vec2(v_texCoord.x, v_texCoord.y + yAdd));
        }
    `;
};

module.exports = outModule;