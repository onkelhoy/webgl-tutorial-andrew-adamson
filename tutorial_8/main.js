const canvas = document.querySelector("canvas");
canvas.width = 600;
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

  in vec2 vTexCoord;
  
  uniform sampler2D uPixelSampler;
  uniform sampler2D uDogSampler;

  out vec4 fragColor;

  void main()
  {
    fragColor = texture(uPixelSampler, vTexCoord) * texture(uDogSampler, vTexCoord);
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

const vertextBufferData = new Float32Array([
  -.9, -.9,
  0.0, 0.9,
  0.9, -.9,
]);

const texCoordBufferData = new Float32Array([
  0,0,
  .5,1,
  1,0,
]);

const pixels = new Uint8Array([
  255,255,255,          230,25,70,          30,45,20,         255,255,25,
  59,20,100,            130,140,200,        205,30,205,       10,10,240,
  40,65,104,            210,50,54,          180,109,44,       10,10,90,
  0,0,0,                100,200,100,        0,0,100,          130,50,0,
]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertextBufferData, gl.STATIC_DRAW);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(0);

const texCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, texCoordBufferData, gl.STATIC_DRAW);
gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(1);

function loadImage() {
  return new Promise(res => {
    const image = new Image();
    image.src = "./dog.png";
    image.onload = () => res(image);
  })
}

(async () => {
  const image = await loadImage();

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  const pixelTextureUnit = 0;
  const dogTextureUnit = 15;

  gl.uniform1i(gl.getUniformLocation(program, "uPixelSampler"), pixelTextureUnit);
  gl.uniform1i(gl.getUniformLocation(program, "uDogSampler"), dogTextureUnit);
  
  const pixelTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, pixelTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 4, 4, 0, gl.RGB, gl.UNSIGNED_BYTE, pixels);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); 
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
  const dogTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + 15);
  gl.bindTexture(gl.TEXTURE_2D, dogTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 472, 470, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); 
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  

  // with mipmaps 
  // gl.generateMipmap(gl.TEXTURE_2D);
  
  // without mipmaps
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); // smooth
  
  gl.drawArrays(gl.TRIANGLES, 0, 3);
})();