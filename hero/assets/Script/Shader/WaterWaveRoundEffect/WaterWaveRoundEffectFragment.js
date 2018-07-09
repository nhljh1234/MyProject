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
            //(0.5, 0.5)是中心
            float posDis = (0.5 - v_texCoord.x) * (0.5 - v_texCoord.x) + (0.5 - v_texCoord.y) * (0.5 - v_texCoord.y);
            posDis = sqrt(posDis);
            float dis = posDis * totalRadian + addX;
            float add = sin(dis) * waveMoveNum;
            float sinNum = (0.5 - v_texCoord.y) / posDis;
            float cosNum = (0.5 - v_texCoord.x) / posDis;
            vec2 newPos = vec2(v_texCoord.x + add * cosNum, v_texCoord.y + add * sinNum);
            gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, newPos);
        }
    `;
};

module.exports = outModule;