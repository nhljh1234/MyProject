var outModule = {};

outModule.getCodeStr = () => {
    return `
        #ifdef GL_ES
        precision lowp float;
        #endif
        
        varying vec4 v_fragmentColor;
        varying vec2 v_texCoord;
        
        uniform float baseRadius;
        uniform int multiple;
        uniform float startX;
        uniform float startY;
        uniform float endX;
        uniform float endY;
        uniform float precisionIn;
        uniform int looperAmount;

        void main()
        {
            gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);
        }
    `;
};

module.exports = outModule;