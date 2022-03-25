/**
 * 通过绘制一个点来演示WebGL程序的过程
 */
//获取canvas
let canvas = getCanvas('#webgl');
//设置canvas尺寸为满屏
resizeCanvas(canvas);
//获取绘图上下文
let gl = getContext(canvas);
//创建着色器程序
let program = createSimpleProgramFromScript(gl, 'vertexShader', 'fragmentShader');
//使用该着色器程序
gl.useProgram(program);

// 顶点坐标数据、颜色数据、索引数据
let sphere = createCube(2.0, 2, 2)
sphere = transformIndicesToUnIndices(sphere) 
// createColorForVertex(sphere);
var positions = sphere.positions;
var colors = sphere.colors;

// 找到着色器全局变量
var u_Matrix = gl.getUniformLocation(program, 'u_Matrix')
var a_Position = gl.getAttribLocation(program, 'a_Position')
var a_Color = gl.getAttribLocation(program, 'a_Color')

var u_LightColor = gl.getUniformLocation(program, 'u_LightColor')
var u_AmbientFactor = gl.getUniformLocation(program, 'u_AmbientFactor')
var u_LightPosition = gl.getUniformLocation(program, 'u_LightPosition')

gl.uniform3f(u_LightColor, 1, 1, 1)
gl.uniform3f(u_LightPosition, 0, 0, 10)
gl.uniform1f(u_AmbientFactor, 1)

// 启用着色器属性
gl.enableVertexAttribArray(a_Position);
gl.enableVertexAttribArray(a_Color);

// 创建缓冲区
var buffer =  gl.createBuffer()
// 绑定缓冲区为当前缓冲
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)  
// 向缓冲区传递数据
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
// 设置a_Position 属性从缓冲区读取数据方式
gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0)

// 创建缓冲区
var colorBuffer =  gl.createBuffer()
// 绑定缓冲区为当前缓冲
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
// 向缓冲区传递数据
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
// 设置a_Color 属性从缓冲区读取数据方式
gl.vertexAttribPointer(a_Color, 4, gl.UNSIGNED_BYTE, true, 0, 0)

//设置清屏颜色为黑色。
gl.clearColor(0, 0, 0, 1);
//隐藏背面
gl.enable(gl.CULL_FACE);

var aspect = canvas.width / canvas.height
// 计算正交投影矩阵
var projectionMatrix = matrix.ortho(-aspect * 4, aspect * 4, -4, 4, 100, -100); 
var deg2radians = window.lib3d.math.deg2radians;
var dstMatrix = matrix.identity();

// 全局变量
var playing = false;
var xAngle =0;
var yAngle = 0;
var dstMatrix = matrix.identity();
var tmpMatrix = matrix.identity();

// 生成指定范围随机数方法
var rand = window.lib3d.math.rand
/** 设置光源颜色、环境光强度因子 */
let light1 = rand(0.3, 0.6)
let light2 = rand(0.2, 0.5)
let light3 = rand(0.2, 0.5)
let ambient = rand(0.3, 0.6)
let ambientIdx = 0
/** 渲染 */
function render(){
  yAngle += 1

  // 先绕 Y 轴旋转矩阵
  matrix.rotationY(deg2radians(yAngle), dstMatrix) 
  //再绕 X 轴旋转
  // matrix.multiply(dstMatrix, matrix.rotationX(deg2radians(xAngle), tmpMatrix), dstMatrix);
  //模型投影矩阵。
  matrix.multiply(projectionMatrix, dstMatrix, dstMatrix);
  // 环境光强度因子 渐变
  let finalAmbient
  ambient = ambient + 0.01
  ambientIdx = Math.ceil(ambient / 4)
  if(ambientIdx % 2 == 0){
    finalAmbient = ambient % 4
  }else{
    finalAmbient = 4 - ambient % 4
  }

  gl.uniformMatrix4fv(u_Matrix, false, dstMatrix);

  gl.clear(gl.COLOR_BUFFER_BIT);
  
  gl.drawArrays(gl.TRIANGLES, 0, sphere.positions.length / 3);
  if(!playing){
      return;
  }
  requestAnimationFrame(render);
}

document.body.addEventListener('click',function(){
  playing = !playing;
  render();  
})
render();