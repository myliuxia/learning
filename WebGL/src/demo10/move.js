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
let sphere = createSphere(2.0,24,48)
sphere = transformIndicesToUnIndices(sphere) 
createColorForVertex(sphere);
var positions = sphere.positions;
var colors = sphere.colors;

// 找到着色器全局变量
var u_Matrix = gl.getUniformLocation(program, 'u_Matrix')
var a_Position = gl.getAttribLocation(program, 'a_Position')
var a_Color = gl.getAttribLocation(program, 'a_Color')

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

// 全局变量
var euler = {x:0, y:0, z:0};
var radian = Math.PI / 180;
var aspect = canvas.width / canvas.height
var projectionMatrix = matrix.ortho(-aspect * 4, aspect * 4, -4, 4, 100, -100); 
var currentMatrix = matrix.identity();
var tempMatrix = matrix.identity();
var lastMatrix = matrix.identity();

/** 旋转 */
function rotate(){
    var dx = currentX - startX;
    var dy = currentY - startY;
    var rate = 0.1
    euler.x = rate * dy * radian;
    euler.y = rate * dx * radian;
    
    // 本次拖拽的临时矩阵
    tempMatrix = matrix.getMatrixFromEuler(euler, tempMatrix);
    // 最近一次变换矩阵与临时矩阵的乘积，得出最终渲染矩阵。
    currentMatrix = matrix.multiply(tempMatrix, lastMatrix);
    
    render();
}
/** 渲染 */
function render(){
  let renderMatrix = matrix.identity();
  matrix.clone(currentMatrix, renderMatrix);
  //模型投影矩阵。
  matrix.multiply(projectionMatrix, renderMatrix, renderMatrix);
  gl.uniformMatrix4fv(u_Matrix, false, renderMatrix);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, sphere.positions.length / 3);
}

// 判断是否支持触摸事件。
var supportTouchEvent = 'ontouchstart' in window;
var dragStartEvent =  supportTouchEvent? 'touchstart': 'mousedown';
var dragMoveEvent =  supportTouchEvent? 'touchmove': 'mousemove';
var dragEndEvent =  supportTouchEvent? 'touchend': 'mouseup';
var startX = 0, startY = 0, currentX = 0, currentY = 0;
var draying = false // 是否拖拽中

//绑定拖拽开始事件
document.body.addEventListener(dragStartEvent, function dragStart(e){
    draying = true
    e = supportTouchEvent ? e.changedTouches[0] : e;
    startX = e.clientX;
    startY = e.clientY;
});
// 绑定拖拽事件
document.body.addEventListener(dragMoveEvent, function dragMove(e){
    if(!draying) return
    e = supportTouchEvent ? e.changedTouches[0] : e;
    currentX = e.clientX;
    currentY = e.clientY;
    rotate();
});

// 绑定拖拽结束事件
document.body.addEventListener(dragEndEvent, function dragEnd(e){
    draying = false
    matrix.clone(currentMatrix, lastMatrix);
});

render();