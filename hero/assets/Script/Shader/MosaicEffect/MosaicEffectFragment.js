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
        uniform float mosaicWidth;

        void main()
        {
            float xNum = float(floor(v_texCoord.x / (oneWidth * mosaicWidth)));
            float yNum = float(floor(v_texCoord.y / (oneHeight * mosaicWidth)));
            gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, vec2(
                (xNum + 0.5) * oneWidth * mosaicWidth,
                (yNum + 0.5) * oneHeight * mosaicWidth
            ));
        }
    `;
};

module.exports = outModule;