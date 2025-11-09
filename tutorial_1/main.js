const canvas = document.querySelector("canvas");
canvas.width = 600;
canvas.height = 400;
const gl = canvas.getContext("webgl2");

const vertexShaderSource = `#version 300 es
  void main()
  {
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    gl_PointSize = 150.0;
  }
`;

const fragmentShaderSource = `#version 300 es

  precision mediump float;
  out vec4 fragColor;

  void main()
  {
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
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

gl.drawArrays(gl.POINTS, 0, 1);