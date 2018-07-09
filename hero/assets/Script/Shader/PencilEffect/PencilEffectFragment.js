var outModule = {};

outModule.getCodeStr = () => {
    return `
        #ifdef GL_ES
        precision lowp float;
        #endif
        
        varying vec4 v_fragmentColor;
        varying vec2 v_texCoord;
        
        uniform float oneWidth;
        uniform float oneHeight;
        uniform vec3 pencilColor;

        void main()
        {
            vec3 totalColor = vec3(0.0);
            totalColor = totalColor + (-0.5) * (v_fragmentColor * texture2D(CC_Texture0, vec2(v_texCoord.x - oneWidth, v_texCoord.y - oneHeight))).rgb;
            totalColor = totalColor + (-1.0) * (v_fragmentColor * texture2D(CC_Texture0, vec2(v_texCoord.x - oneWidth, v_texCoord.y))).rgb;
            totalColor = totalColor + (-1.0) * (v_fragmentColor * texture2D(CC_Texture0, vec2(v_texCoord.x, v_texCoord.y - oneHeight))).rgb;
            totalColor = totalColor + (0.5) * (v_fragmentColor * texture2D(CC_Texture0, vec2(v_texCoord.x + oneWidth, v_texCoord.y + oneHeight))).rgb;
            totalColor = totalColor + (1.0) * (v_fragmentColor * texture2D(CC_Texture0, vec2(v_texCoord.x + oneWidth, v_texCoord.y))).rgb;
            totalColor = totalColor + (1.0) * (v_fragmentColor * texture2D(CC_Texture0, vec2(v_texCoord.x, v_texCoord.y + oneHeight))).rgb;

            //计算灰度
            float gray = totalColor.r * 0.3 + totalColor.g * 0.59 + totalColor.b * 0.11;
            gray = 1.0 - abs(gray);
            gl_FragColor = vec4(gray, gray, gray, 1.0);
        }
    `;
};

module.exports = outModule;