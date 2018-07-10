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
            //在圆周上实现sin曲线，每个圆周上的点在半径支线上做sin曲线运动
            //总弧度
            //这边是一个增加弧度周期的操作，n个弧度的时候，需要在1/n * 0.5的基础上实现一个0 - 2 * PI的循环，所以后面乘了一个totalRadian
            float totalRadian = waveNum * 3.1415926;
            //(0.5, 0.5)是中心
            float posDis = (0.5 - v_texCoord.x) * (0.5 - v_texCoord.x) + (0.5 - v_texCoord.y) * (0.5 - v_texCoord.y);
            posDis = sqrt(posDis);
            //因为半径是0.5，计算的时候需要除以这个半径
            float dis = posDis * totalRadian * 2.0 + addX;
            float add = sin(dis) * waveMoveNum;
            float sinNum = (0.5 - v_texCoord.y) / posDis;
            float cosNum = (0.5 - v_texCoord.x) / posDis;
            vec2 newPos = vec2(v_texCoord.x + add * cosNum, v_texCoord.y + add * sinNum);
            gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, newPos);
        }
    `;
};

module.exports = outModule;