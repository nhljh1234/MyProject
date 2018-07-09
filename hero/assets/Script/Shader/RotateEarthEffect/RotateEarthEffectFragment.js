var outModule = {};

outModule.getCodeStr = () => {
    return `
        #ifdef GL_ES
        precision lowp float;
        #endif
        
        varying vec4 v_fragmentColor;
        varying vec2 v_texCoord;
        
        uniform float ratio;
        uniform float time;

        void main()
        {
            //获取x轴上的缩放比例
            //需要模拟一个z轴坐标
            float x = v_texCoord.x;
            float y = v_texCoord.y;
            //裁剪圆角
            float xAdd = abs(x - 0.5) * ratio;
            float yAdd = abs(y - 0.5);
            float dis = sqrt(xAdd * xAdd + yAdd * yAdd);
            if (dis > 0.5)
            {
                gl_FragColor = vec4(0.0);
                return;
            }
            float mid = 0.5 + time;
            if (mid > 1.0)
            {
                mid = mid - 1.0;
            }
            //球形削减弧度
            //asin(dis / r);
            float cosNum, sinNum;
            cosNum = xAdd / dis;
            sinNum = yAdd / dis;
            float aSinNum = asin(dis * 2.0) / 3.14;
            if (x > 0.5)
            {
                x = mid + cosNum * aSinNum / ratio;
            }
            else
            {
                x = mid - cosNum * aSinNum / ratio;
            }
            if (y > 0.5)
            {
                y = 0.5 + sinNum * aSinNum;
            }
            else
            {
                y = 0.5 - sinNum * aSinNum;
            }
            if (x > 1.0)
            {
                x = x - 1.0;
            }
            if (x < 0.0)
            {
                x = x + 1.0;
            }
            gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, vec2(x, y));
        }
    `;
};

module.exports = outModule;