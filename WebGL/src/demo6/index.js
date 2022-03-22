/**
 * 通过绘制一个点来演示WebGL程序的过程
 */
//获取canvas
let canvas = getCanvas('#webgl');
//设置canvas尺寸为满屏
resizeCanvas(canvas);
//获取绘图上下文
let gl = getContext(canvas);
//创建顶点着色器
var vertexShader = createShaderFromScript(gl, gl.VERTEX_SHADER,'vertexShader');
//创建片元着色器
var fragmentShader = createShaderFromScript(gl, gl.FRAGMENT_SHADER,'fragmentShader');
//创建着色器程序
let program = createSimpleProgram(gl, vertexShader, fragmentShader);
//使用该着色器程序
gl.useProgram(program);

// 顶点坐标数据
var positions = [
  30, 30, 0, 0,    //V0
  30, 300, 0, 1,   //V1
  300, 300, 1, 1,  //V2
  30, 30, 0, 0,    //V0
  300, 300, 1, 1,  //V2
  300, 30, 1, 0    //V3
]

// 找到着色器全局变量 u_Texture
var u_Texture = gl.getUniformLocation(program, 'u_Texture')
var a_Screen_Size = gl.getUniformLocation(program, 'a_Screen_Size')
gl.uniform2f(a_Screen_Size, canvas.width, canvas.height)
var a_Position = gl.getAttribLocation(program, 'a_Position')
var a_Uv = gl.getAttribLocation(program, 'a_Uv')

// 启用着色器属性
gl.enableVertexAttribArray(a_Position)
gl.enableVertexAttribArray(a_Uv)

// 创建缓冲区
var buffer =  gl.createBuffer()
// 绑定缓冲区为当前缓冲
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
// 设置a_Position 属性从缓冲区读取数据方式
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 16, 0)
// 设置a_Position 属性从缓冲区读取数据方式
gl.vertexAttribPointer(a_Uv, 2, gl.FLOAT, false, 16, 8)
// 向缓冲区传递数据
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

// 设置清屏颜色为黑色
gl.clearColor(0, 0, 0, 1)

function render(){
  gl.clear(gl.COLOR_BUFFER_BIT)
  if(positions.length <= 0){
    return
  }
  gl.drawArrays(gl.TRIANGLES, 0, positions.length/4)
}

loadTexture(gl, './rb.jpg', u_Texture, function(){
  render()
})



