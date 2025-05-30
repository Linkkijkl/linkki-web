let canvas;
let container;
let shaderPath;

let gl = null;
let shaderProgram;
let resolutionLocation;
let vertexArray = new Float32Array;
let darkModeLocation;


const resizeCanvas = () => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    if (gl != null) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    }
}


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


window.addEventListener("DOMContentLoaded", async () => {
    canvas = document.querySelector("#shader");
    if (!canvas) return;
    shaderPath = canvas.getAttribute("data-shader");
    container = document.querySelector(".home-carousel, #heading-breadcrumbs");

    new ResizeObserver((entires) => {
        for (const entry of entires) {
            resizeCanvas();
        }
    }).observe(container);

    gl = canvas.getContext("webgl2");
    if (!gl) return;

    const getShaderSource = url => fetch(url).then(response => response.text());

    const vertex = document.querySelector('script[type="x-shader/x-vertex"]');
    const fragment = document.querySelector('script[type="x-shader/x-fragment');
    if (!vertex || !fragment) return;

    shaderProgram = buildShaderProgram([
        {
            type: gl.VERTEX_SHADER,
            code: await getShaderSource(vertex.src)
        },
        {
            type: gl.FRAGMENT_SHADER,
            code: await getShaderSource(fragment.src)
        }
    ]);

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
    resolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
    const timeLocation = gl.getUniformLocation(shaderProgram, "u_time");
    const accentLocation = gl.getUniformLocation(shaderProgram, "u_primary_accent");
    darkModeLocation = gl.getUniformLocation(shaderProgram, "u_dark_mode");
    const randomLocation = gl.getUniformLocation(shaderProgram, "u_random");

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
    gl.uniform3f(accentLocation, pa[0] / 255.0, pa[1] / 255.0, pa[2] / 255.0);
    gl.uniform1i(darkModeLocation, isThemeDark());
    gl.uniform1f(randomLocation, Math.random() * 1000.0);

    let timeTracker = 0.0;
    let startTime = document.timeline.currentTime;

    function render() {
        timeTracker = (document.timeline.currentTime - startTime) * 0.001;

        gl.uniform1f(timeLocation, timeTracker);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        window.requestAnimationFrame(render);
    }

    render();
});


document.getRootNode().addEventListener("onThemeChange", () => {
    if (gl) gl.uniform1i(darkModeLocation, isThemeDark());
});
