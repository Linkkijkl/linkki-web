const canvas = document.getElementById("shader");
const homeCarousel = document.getElementsByClassName("home-carousel")[0];
const shaderPath = canvas.getAttribute("data-shader");

let gl = null;
let shaderProgram;
let resolutionLocation;
let vertexArray = new Float32Array

const resizeCanvas = () => {
    canvas.width = homeCarousel.clientWidth;
    canvas.height = homeCarousel.clientHeight;
    if (gl != null) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    }
}

new ResizeObserver((entires) => {
    for (const entry of entires) {
        resizeCanvas();
    }
}).observe(homeCarousel);



const compileShader = (code, type) => {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, code);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(
            `Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"
            } shader:`,
        );
        console.log(gl.getShaderInfoLog(shader));
    }
    return shader;
}



const buildShaderProgram = (shaderInfo) => {
    const program = gl.createProgram();

    shaderInfo.forEach((desc) => {
        const shader = compileShader(desc.code, desc.type);

        if (shader) {
            gl.attachShader(program, shader);
        }
    });

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("Error linking shader program:");
        console.log(gl.getProgramInfoLog(program));
    }

    return program;
};


const getPrimaryAccent = () => {
    const hexToRgb = hex =>
        hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
            , (m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1).match(/.{2}/g)
            .map(x => parseInt(x, 16));
    return hexToRgb(
        getComputedStyle(document.body).getPropertyValue('--primary-accent')
    );
};


window.onload = () => {
    gl = canvas.getContext("webgl2");
    if (!gl) return;

    shaderProgram = buildShaderProgram([
        {
            type: gl.VERTEX_SHADER,
            code: `#version 300 es
            in vec4 a_position;

            void main() {
                gl_Position = a_position;
            }`
        },
        {
            type: gl.FRAGMENT_SHADER,
            code: `#version 300 es
            precision highp float;

            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec3 u_primary_accent;
            
            out vec4 outColor;
            
            vec3 hash33(vec3 p3)
            {
                p3 = fract(p3 * vec3(443.8975,397.2973, 491.1871));
                p3 += dot(p3, p3.yxz+19.19);
                return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
            }
        
            float simplex_noise(vec3 p)
            {
                const float K1 = 0.333333333;
                const float K2 = 0.166666667;
                
                vec3 i = floor(p + (p.x + p.y + p.z) * K1);
                vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
                
                // thx nikita: https://www.shadertoy.com/view/XsX3zB
                vec3 e = step(vec3(0.0), d0 - d0.yzx);
                vec3 i1 = e * (1.0 - e.zxy);
                vec3 i2 = 1.0 - e.zxy * (1.0 - e);
                
                vec3 d1 = d0 - (i1 - 1.0 * K2);
                vec3 d2 = d0 - (i2 - 2.0 * K2);
                vec3 d3 = d0 - (1.0 - 3.0 * K2);
                
                vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
                vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));
                
                return dot(vec4(31.316), n);
            }

            void main() {
                vec2 a = vec2(gl_FragCoord.xy / u_resolution);
                float simplex = 1.0 - simplex_noise(vec3(a.x, a.y, u_time * 0.1));
                vec3 color = vec3(simplex) * u_primary_accent;
                outColor = vec4(mix(u_primary_accent, color, min(u_time * 0.3, 1.0)), 1);
            }`
        }
    ]);

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
    resolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
    const timeLocation = gl.getUniformLocation(shaderProgram, "u_time");
    const accentLocation = gl.getUniformLocation(shaderProgram, "u_primary_accent");

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // Create a buffer to put three 2d clip space points in
    const positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // fill it with a 2 triangles that cover clip space
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,  // first triangle
        1, -1,
        -1, 1,
        -1, 1,  // second triangle
        1, -1,
        1, 1,
    ]), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(
        positionAttributeLocation,
        2,          // 2 components per iteration
        gl.FLOAT,   // the data is 32bit floats
        false,      // don't normalize the data
        0,          // 0 = move forward size * sizeof(type) each iteration to get the next position
        0,          // start at the beginning of the buffer
    );

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.useProgram(shaderProgram);
    gl.bindVertexArray(vao);

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    const pa = getPrimaryAccent();
    console.log(pa);
    gl.uniform3f(accentLocation, pa[0] / 255.0, pa[1] / 255.0, pa[2] / 255.0);


    gl.uniform3f

    let timeTracker = 0.0;
    let startTime = document.timeline.currentTime;

    function render() {
        timeTracker = (document.timeline.currentTime - startTime) * 0.001;

        gl.uniform1f(timeLocation, timeTracker);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        window.requestAnimationFrame(render);
    }

    render();
}
