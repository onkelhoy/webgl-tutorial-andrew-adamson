const canvas = document.querySelector("canvas");
canvas.width = 400;
canvas.height = 400;
const gl = canvas.getContext("webgl2");


const vertexShaderSource = `#version 300 es

  layout(location=0) in vec4 aPosition;
  layout(location=1) in vec2 aTexCoord;

  out vec2 vTexCoord;

  void main()
  {
    vTexCoord = aTexCoord;
    gl_Position = aPosition;
  }
`;

const fragmentShaderSource = `#version 300 es

  precision mediump float;

  uniform sampler2D uSampler;
  in vec2 vTexCoord;
  out vec4 fragColor;

  void main()
  {
    fragColor = texture(uSampler, vTexCoord);
  }
`;

const program = gl.createProgram();
{
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
}

gl.useProgram(program); 

const positionData = new Float32Array([
  // Quad 1
  -1,0,
  0,1,
  -1,1,
  -1,0,
  0,0,
  0,1,

  // Quad 2
  0,0,
  1,1,
  0,1,
  0,0,
  1,0,
  1,1,

  // Quad 3
  -1,-1,
  0,0,
  -1,0,
  -1,-1,
  0,-1,
  0,0,

  // Quad 4
  0,-1,
  1,0,
  0,0,
  0,-1,
  1,-1,
  1,0,
]);

function loadImage() {
  return new Promise(res => {
    const image = new Image();
    image.src = "./atlas.png";
    image.onload = () => res(image);
  });
}

async function createUVlookup() {
  const res = await fetch("./atlas.json");
  const data = await res.json();

  const w = 128 / 1024;
  const h = 128 / 2048;

  const uPadding = .25 / 1024;
  const vPadding = .25 / 2048;

  return (name) => {
    if (!data[name]) return null;

    const [u, v] =  data[name];
    return [
      u + uPadding,        v + h - vPadding,
      u + w - uPadding,    v + vPadding,
      u + uPadding,        v + vPadding,

      u + uPadding,        v + h - vPadding,
      u + w - uPadding,    v + h - vPadding,
      u + w - uPadding,    v + vPadding,
    ];
  }
}

async function init() {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  const texCoordData = new Float32Array(2 * 4 * 6);
  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, texCoordData.byteLength, gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(1);

  const image = await loadImage();
  const lookupUV = await createUVlookup();
  texCoordData.set(lookupUV("medievalTile_03"), 0);
  texCoordData.set(lookupUV("medievalTile_17"), 12);
  texCoordData.set(lookupUV("medievalTile_05"), 24);
  texCoordData.set(lookupUV("medievalTile_07"), 36);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, texCoordData);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1024, 2048, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);


  gl.drawArrays(gl.TRIANGLES, 0, 24);
}

init();