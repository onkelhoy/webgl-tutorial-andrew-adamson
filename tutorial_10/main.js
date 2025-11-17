const canvas = document.querySelector("canvas");
canvas.width = 600;
canvas.height = 400;
const gl = canvas.getContext("webgl2");

const vss1 = `#version 300 es

  layout(location = 0) in float aPointSize;
  layout(location = 1) in vec2 aPosition;
  layout(location = 2) in vec3 aColor;

  out vec3 vColor;

  void main()
  {
    vColor = aColor;
    gl_PointSize = aPointSize;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fss1 = `#version 300 es

  precision mediump float;

  in vec3 vColor;

  out vec4 fragColor;

  void main()
  {
    fragColor = vec4(vColor, 1.0);
  }
`;

const program = gl.createProgram();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vss1);
gl.compileShader(vertexShader);
gl.attachShader(program, vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fss1);
gl.compileShader(fragmentShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS))
{
  console.log({
    vertex: gl.getShaderInfoLog(vertexShader),
    fragment: gl.getShaderInfoLog(fragmentShader),
    program: gl.getProgramInfoLog(program),
  });
}

gl.useProgram(program);

const data1 = new Float32Array([
  -.8,.6,     1,.75,.75,    125,
  -.3,.6,     0,.75,1,      32,
  .3,.6,      .5,1,.75,     75,
  .8,.6,      0,.75,.75,    9,
]);
const buffer1 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
gl.bufferData(gl.ARRAY_BUFFER, data1, gl.STATIC_DRAW);

const vao1 = gl.createVertexArray();
gl.bindVertexArray(vao1); // <---- VAO 1 scope BEGIN

gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 24, 20);
gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 24, 0);
gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 24, 8);

gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);
gl.enableVertexAttribArray(2);

gl.bindVertexArray(null); // <---- VAO 1 scope END

const data2 = new Float32Array([
  -.8,-.6,     .25,0,0,     25,
  -.3,-.6,     0,0,.25,     132,
  .3,-.6,      0,.25,0,     105,
  .6,-.6,      .25,0,.25,   90,
]);
const buffer2 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
gl.bufferData(gl.ARRAY_BUFFER, data2, gl.STATIC_DRAW);

const vao2 = gl.createVertexArray();
gl.bindVertexArray(vao2); // <---- VAO 2 scope BEGIN

gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 24, 20);
gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 24, 0);
gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 24, 8);

gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);
gl.enableVertexAttribArray(2);

gl.bindVertexArray(null); // <---- VAO 2 scope END

function draw() {
  gl.flush();
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindVertexArray(vao1);
  gl.drawArrays(gl.POINTS, 0, 4);
  gl.bindVertexArray(null);
  
  gl.bindVertexArray(vao2);
  gl.drawArrays(gl.POINTS, 0, 4);
  gl.bindVertexArray(null);
}

draw();
