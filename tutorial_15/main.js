const canvas = document.querySelector("canvas");
canvas.width = 600;
canvas.height = 400;
const gl = canvas.getContext("webgl2");

import { Matrix4 } from "./matrix.js";

const vertexShaderSource = `#version 300 es

  uniform mat4 uModel;
  uniform mat4 uView;
  uniform mat4 uProjection;

  layout(location=0) in vec4 aPosition;
  layout(location=1) in vec4 aColor;

  out vec4 vColor;

  void main()
  {
    vColor = aColor;
    gl_Position = uProjection * uView * uModel * aPosition;
  }
`;

const fragmentShaderSource = `#version 300 es

  precision mediump float;

  in vec4 vColor;

  out vec4 fragColor;

  void main()
  {
    fragColor = vColor;
  }
`;

const program = gl.createProgram();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
gl.attachShader(program, vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS))
{
  console.log({
    vertex: gl.getShaderInfoLog(vertexShader),
    fragment: gl.getShaderInfoLog(fragmentShader),
  });
}

gl.useProgram(program); 

gl.enable(gl.DEPTH_TEST);

const vertexData = new Float32Array([
  -.5,-.5,-.5,   0,1,1, // face 1 
  -.5, .5, .5,   0,1,1,
  -.5, .5,-.5,   0,1,1,
  -.5,-.5, .5,   0,1,1,
  -.5, .5, .5,   0,1,1,
  -.5,-.5,-.5,   0,1,1,

  .5 ,-.5,-.5,   1,0,1, // face 2 
  .5 , .5,-.5,   1,0,1,
  .5 , .5, .5,   1,0,1,
  .5 , .5, .5,   1,0,1,
  .5 ,-.5, .5,   1,0,1,
  .5 ,-.5,-.5,   1,0,1,

  -.5,-.5,-.5,   0,1,0, // face 3
   .5,-.5,-.5,   0,1,0,
   .5,-.5, .5,   0,1,0,
   .5,-.5, .5,   0,1,0,
  -.5,-.5, .5,   0,1,0,
  -.5,-.5,-.5,   0,1,0,

  -.5, .5,-.5,   1,1,0, // face 4
   .5, .5, .5,   1,1,0,
   .5, .5,-.5,   1,1,0,
  -.5, .5, .5,   1,1,0,
   .5, .5, .5,   1,1,0,
  -.5, .5,-.5,   1,1,0,

   .5,-.5,-.5,   0,0,1, // face 5
  -.5,-.5,-.5,   0,0,1,
   .5, .5,-.5,   0,0,1,
  -.5, .5,-.5,   0,0,1,
   .5, .5,-.5,   0,0,1,
  -.5,-.5,-.5,   0,0,1,

  -.5,-.5, .5,   1,0,0, // face 6
   .5,-.5, .5,   1,0,0,
   .5, .5, .5,   1,0,0,
   .5, .5, .5,   1,0,0,
  -.5, .5, .5,   1,0,0,
  -.5,-.5, .5,   1,0,0,
]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);

const modelLoc = gl.getUniformLocation(program, "uModel");
const viewLoc = gl.getUniformLocation(program, "uView");
const projectionLoc = gl.getUniformLocation(program, "uProjection");

const model = Matrix4.create();
const view = Matrix4.create();
const projection = Matrix4.create();

model.scale(0.8);

view.lookAt([.6,.6,.6], [0,0,0], [0,1,0])
// projection.perspective(Math.PI/1.5, gl.canvas.width / gl.canvas.height, .1, 10);
projection.orthographic(-1,1, -1,1, -1,2)

gl.uniformMatrix4fv(viewLoc, false, view);
gl.uniformMatrix4fv(projectionLoc, false, projection);

function draw() {
  model.rotateZ(0.02);
  model.rotateX(0.02);
  gl.uniformMatrix4fv(modelLoc, false, model);

  gl.drawArrays(gl.TRIANGLES, 0, 36);

  requestAnimationFrame(draw);
}

draw();
