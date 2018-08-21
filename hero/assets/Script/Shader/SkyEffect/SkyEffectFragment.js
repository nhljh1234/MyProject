var outModule = {};

outModule.getCodeStr = () => {
    return `
        #ifdef GL_ES
        precision lowp float;
        #endif
        
        varying vec4 v_fragmentColor;
        varying vec2 v_texCoord;
        
        uniform vec3 skyColor;
        uniform vec3 cloudColor;
        uniform vec2 resolution;
        uniform float cloudSize;
        uniform float time;

        float rand(vec2 n)
        {
            return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }
         
        float noise(vec2 n)
        {
            const vec2 d = vec2(0.0, 1.0);
            vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
            return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
        }
         
        void main()
        {
            // 柏林噪声
            float total = 0.0;
            vec2 pos = v_texCoord * cloudSize;
            pos.x = (resolution.x / resolution.y - 1.0) / 2.0;
            total += noise(pos * 1.0 + vec2(time * 2.0, 0.0));
            total += noise(pos * 2.0 + vec2(0.0, time * 3.0)) * 0.5;
            total += noise(pos * 4.0 + vec2(time * 4.0, 0.0)) * 0.25;
            total += noise(pos * 8.0 + vec2(0.0, time * 5.0)) * 0.125;
            vec3 color = mix(skyColor, cloudColor, total);
         
            // 越边缘越透明
            vec2 alpha = 1.0 - abs(v_texCoord - vec2(0.5)) * 2.0;
            gl_FragColor = vec4(color, alpha.x * alpha.y);
        }        
    `;
};

module.exports = outModule;