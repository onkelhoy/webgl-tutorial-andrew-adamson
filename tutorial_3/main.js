const canvas = document.querySelector("canvas");
canvas.width = 600;
canvas.height = 400;
const gl = canvas.getContext("webgl2");

const vertexShaderSource = `#version 300 es

  uniform float uPointSize;
  uniform vec2 uPosition;

  void main()
  {
    gl_Position = vec4(uPosition, 0.0, 1.0);
    gl_PointSize = uPointSize;
  }
`;

const fragmentShaderSource = `#version 300 es

  precision mediump float;

  uniform int uIndex;
  uniform vec4 uColors[3];

  out vec4 fragColor;

  void main()
  {
    fragColor = uColors[uIndex];
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

const uPointSizeLoc = gl.getUniformLocation(program, "uPointSize");
const uPositionLoc = gl.getUniformLocation(program, "uPosition");

const uIndexLoc = gl.getUniformLocation(program, "uIndex");
const uColorsLoc = gl.getUniformLocation(program, "uColors");

gl.uniform1i(uIndexLoc, 2); // CHANGE ME 0-3
gl.uniform4fv(uColorsLoc, [
  1,0,0,1,
  0,1,0,1,
  0,0,1,1,
]);

gl.uniform1f(uPointSizeLoc, 100);
gl.uniform2f(uPositionLoc, 0, .2);

gl.drawArrays(gl.POINTS, 0, 1);

gl.uniform1i(uIndexLoc, 1);
gl.uniform1f(uPointSizeLoc, 25);
gl.uniform2f(uPositionLoc, 0.8, -.6);

gl.drawArrays(gl.POINTS, 0, 1);


gl.uniform1i(uIndexLoc, 0);
gl.uniform1f(uPointSizeLoc, 80);
gl.uniform2f(uPositionLoc, 0.1, .6);

gl.drawArrays(gl.POINTS, 0, 1);
